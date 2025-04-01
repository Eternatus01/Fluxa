interface CommentLimits {
    minLength: number;
    maxLength: number;
    minInterval: number; // в миллисекундах
    maxCommentsPerHour: number;
    maxRepliesPerComment: number;
    maxNestingLevel: number;
    maxLinksPerComment: number;
}

export const DEFAULT_LIMITS: CommentLimits = {
    minLength: 3,
    maxLength: 1000,
    minInterval: 30000, // 30 секунд
    maxCommentsPerHour: 10,
    maxRepliesPerComment: 5,
    maxNestingLevel: 3,
    maxLinksPerComment: 2
};

export class CommentValidator {
    private static readonly REPEATED_CHARS_REGEX = /(.)\1{4,}/;
    private static readonly REPEATED_WORDS_REGEX = /\b(\w+)(?:\s+\1\b)+/;
    private static readonly URL_REGEX = /(https?:\/\/[^\s]+)/g;
    private static readonly SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

    static validateLength(text: string, limits: CommentLimits): boolean {
        if (!text) return false;
        return text.length >= limits.minLength && text.length <= limits.maxLength;
    }

    static validateRepeatedChars(text: string): boolean {
        return !this.REPEATED_CHARS_REGEX.test(text);
    }

    static validateRepeatedWords(text: string): boolean {
        return !this.REPEATED_WORDS_REGEX.test(text);
    }

    static validateLinks(text: string, maxLinks: number): boolean {
        const links = text.match(this.URL_REGEX) || [];
        return links.length <= maxLinks;
    }

    static validateSpecialChars(text: string): boolean {
        const specialChars = text.match(this.SPECIAL_CHARS_REGEX) || [];
        return specialChars.length <= text.length * 0.3; // максимум 30% специальных символов
    }

    static validateNestingLevel(currentLevel: number, maxLevel: number): boolean {
        return currentLevel <= maxLevel;
    }

    static validateComment(text: string, limits: CommentLimits): { isValid: boolean; error?: string } {
        if (!this.validateLength(text, limits)) {
            return {
                isValid: false,
                error: `Комментарий должен содержать от ${limits.minLength} до ${limits.maxLength} символов`
            };
        }

        if (!this.validateRepeatedChars(text)) {
            return {
                isValid: false,
                error: 'Комментарий содержит слишком много повторяющихся символов'
            };
        }

        if (!this.validateRepeatedWords(text)) {
            return {
                isValid: false,
                error: 'Комментарий содержит повторяющиеся слова'
            };
        }

        if (!this.validateLinks(text, limits.maxLinksPerComment)) {
            return {
                isValid: false,
                error: `Комментарий содержит слишком много ссылок (максимум ${limits.maxLinksPerComment})`
            };
        }

        if (!this.validateSpecialChars(text)) {
            return {
                isValid: false,
                error: 'Комментарий содержит слишком много специальных символов'
            };
        }

        return { isValid: true };
    }
}

export class CommentRateLimiter {
    private static readonly userComments: Map<string, number[]> = new Map();
    private static readonly userLastComment: Map<string, number> = new Map();

    static canComment(userId: string, limits: CommentLimits): { canComment: boolean; error?: string } {
        const now = Date.now();
        const lastCommentTime = this.userLastComment.get(userId) || 0;
        const userComments = this.userComments.get(userId) || [];

        // Проверяем минимальный интервал
        if (now - lastCommentTime < limits.minInterval) {
            const waitTime = Math.ceil((limits.minInterval - (now - lastCommentTime)) / 1000);
            return {
                canComment: false,
                error: `Подождите ${waitTime} секунд перед отправкой следующего комментария`
            };
        }

        // Проверяем количество комментариев за последний час
        const oneHourAgo = now - 3600000; // 1 час в миллисекундах
        const recentComments = userComments.filter(time => time > oneHourAgo);

        if (recentComments.length >= limits.maxCommentsPerHour) {
            return {
                canComment: false,
                error: `Вы достигли лимита комментариев (${limits.maxCommentsPerHour} в час)`
            };
        }

        // Обновляем данные
        this.userLastComment.set(userId, now);
        this.userComments.set(userId, [...recentComments, now]);

        return { canComment: true };
    }

    static clearUserData(userId: string): void {
        this.userComments.delete(userId);
        this.userLastComment.delete(userId);
    }
} 
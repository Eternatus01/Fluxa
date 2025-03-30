/**
 * Сервис для работы с локальным хранилищем
 */
export class StorageService {
    /**
     * Получить данные из хранилища
     * @param key - Ключ
     * @returns Данные или null, если данных нет или они устарели
     */
    get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const { data, expiry } = JSON.parse(item);

            // Проверяем, не устарели ли данные
            if (expiry && expiry < Date.now()) {
                localStorage.removeItem(key);
                return null;
            }

            return data as T;
        } catch (error) {
            console.error('Ошибка при получении данных из хранилища:', error);
            return null;
        }
    }

    /**
     * Сохранить данные в хранилище
     * @param key - Ключ
     * @param data - Данные для сохранения
     * @param ttl - Время жизни в миллисекундах (если не указано, данные не устаревают)
     */
    set<T>(key: string, data: T, ttl?: number): void {
        try {
            const item = {
                data,
                expiry: ttl ? Date.now() + ttl : null
            };

            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error('Ошибка при сохранении данных в хранилище:', error);
        }
    }

    /**
     * Удалить данные из хранилища
     * @param key - Ключ
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Ошибка при удалении данных из хранилища:', error);
        }
    }

    /**
     * Очистить все хранилище
     */
    clear(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Ошибка при очистке хранилища:', error);
        }
    }

    /**
     * Удалить все устаревшие записи из хранилища
     */
    cleanup(): void {
        try {
            const now = Date.now();

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key) continue;

                const item = localStorage.getItem(key);
                if (!item) continue;

                try {
                    const { expiry } = JSON.parse(item);
                    if (expiry && expiry < now) {
                        localStorage.removeItem(key);
                    }
                } catch {
                    // Игнорируем ошибки парсинга
                }
            }
        } catch (error) {
            console.error('Ошибка при очистке устаревших данных:', error);
        }
    }
}

// Создаем единственный экземпляр сервиса хранилища
export const storageService = new StorageService();
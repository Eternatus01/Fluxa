import { useCommentsApi } from "../composable/useCommentsApi";
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
    Comment,
    CommentsState,
    VideoId,
    CommentId,
    CommentText,
    CommentError
} from '../type/Comment';
import { UserId } from '../../user/types/userTypes';
import { CommentValidator, CommentRateLimiter, DEFAULT_LIMITS } from '../utils/commentLimits';
import { useUserStore } from '@/features/user/stores/userStore';
import { useUiStore } from '@/shared/stores/uiStore';

export const useCommentsStore = defineStore("comments", () => {
    const commentsApi = useCommentsApi();
    const userStore = useUserStore();
    const uiStore = useUiStore();

    // Реактивные состояния
    const commentsMap = ref<Record<VideoId, Comment[]>>({});
    const repliesMap = ref<Record<CommentId, Comment[]>>({});
    const error = ref<CommentError | null>(null);

    const getComments = computed(() => commentsMap.value);
    const getError = computed(() => error.value);

    const addComment = async (
        videoId: VideoId,
        userId: UserId,
        text: CommentText,
        parentCommentId?: CommentId
    ): Promise<Comment | undefined> => {
        if (!userStore.user) {
            error.value = { message: 'Необходимо авторизоваться', status: 401 };
            return undefined;
        }

        // Проверяем ограничения по контенту
        const contentValidation = CommentValidator.validateComment(text, DEFAULT_LIMITS);
        if (!contentValidation.isValid) {
            error.value = { message: contentValidation.error || 'Ошибка валидации комментария' };
            return undefined;
        }

        // Проверяем ограничения по частоте
        const rateLimit = CommentRateLimiter.canComment(userId, DEFAULT_LIMITS);
        if (!rateLimit.canComment) {
            error.value = { message: rateLimit.error || 'Превышен лимит комментариев' };
            return undefined;
        }

        // Проверяем уровень вложенности для ответов
        if (parentCommentId) {
            const parentComment = commentsMap.value[videoId]?.find(c => c.id === parentCommentId);
            if (parentComment) {
                // Если это ответ на ответ, проверяем уровень вложенности родительского комментария
                if (parentComment.parent_id) {
                    error.value = { message: `Максимальная глубина вложенности комментариев: ${DEFAULT_LIMITS.maxNestingLevel}` };
                    return undefined;
                }
            }
        }

        uiStore.isLoading = true;
        error.value = null;

        try {
            const data = await commentsApi.addComment(videoId, userId, text, parentCommentId);

            // Обновляем кэш комментариев
            if (!parentCommentId) {
                // Если это новый комментарий к видео
                if (!commentsMap.value[videoId]) {
                    commentsMap.value[videoId] = [];
                }
                commentsMap.value[videoId].unshift(data);
            } else {
                // Если это ответ на комментарий
                if (!repliesMap.value[parentCommentId]) {
                    repliesMap.value[parentCommentId] = [];
                }
                repliesMap.value[parentCommentId].unshift(data);
            }

            return data;
        } catch (err) {
            error.value = err as CommentError;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const fetchComments = async (video_id: VideoId): Promise<Comment[] | undefined> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            // Очищаем кэш перед запросом
            commentsApi.invalidateCommentsCache(video_id);

            const data = await commentsApi.fetchComments(video_id);

            // Сохраняем данные в локальное состояние
            commentsMap.value[video_id] = data;

            return data;
        } catch (err) {
            error.value = err as CommentError;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const deleteComment = async (comment_id: CommentId): Promise<void> => {
        if (!userStore.user) {
            error.value = { message: 'Необходимо авторизоваться', status: 401 };
            return;
        }

        uiStore.isLoading = true;
        error.value = null;

        try {
            await commentsApi.deleteComment(comment_id);

            // Удаляем ответы на этот комментарий
            delete repliesMap.value[comment_id];

        } catch (err) {
            error.value = err as CommentError;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const getReplies = async (comment_id: CommentId): Promise<Comment[] | undefined> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            const data = await commentsApi.getReplies(comment_id);

            // Сохраняем данные в локальное состояние
            repliesMap.value[comment_id] = data;

            return data;
        } catch (err) {
            error.value = err as CommentError;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    // Очистка кэша комментариев
    const clearCache = (): void => {
        commentsMap.value = {};
        repliesMap.value = {};
        commentsApi.clearCommentsCache();
    };

    return {
        addComment,
        fetchComments,
        deleteComment,
        getReplies,
        clearCache,

        // Состояния
        comments: getComments,
        replies: computed(() => repliesMap.value),
        error: getError
    };
});
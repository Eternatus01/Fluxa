import { apiClient } from './../../../widgets/apiClient';
import { useApiWithCache } from '../../../shared/composables/useApiWithCache';
import {
    Comment,
    CommentId,
    VideoId,
    CommentText,
    CommentError
} from '../type/Comment';
import { UserId } from '../../user/types/userTypes';

export const useCommentsApi = () => {
    const api = useApiWithCache('comments', {
        baseUrl: 'http://localhost:3001',
        defaultCacheOptions: {
            enabled: false, // Отключаем кэширование по умолчанию
            ttl: 0,
            persistent: false
        }
    });

    const addComment = async (
        videoId: VideoId,
        userId: UserId,
        text: CommentText,
        parentCommentId?: CommentId
    ): Promise<Comment> => {
        try {
            const data = await apiClient<Comment>(`/api/video/${videoId}/comments`, {
                method: 'POST',
                data: { videoId, userId, text, parentCommentId }
            });

            // Инвалидируем кэш комментариев для этого видео
            invalidateCommentsCache(videoId);

            return data;
        } catch (error) {
            const err = error as Error;
            const commentError: CommentError = {
                message: err?.message || 'Не удалось добавить комментарий',
                status: 500
            };
            throw commentError;
        }
    };

    const fetchComments = async (videoId: VideoId): Promise<Comment[]> => {
        try {
            const data = await apiClient<Comment[]>(`/api/video/${videoId}/comments`, {
                method: 'GET',
                params: { videoId },
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            return data;
        } catch (error) {
            const err = error as Error;
            const commentError: CommentError = {
                message: err?.message || 'Не удалось загрузить комментарии',
                status: 500
            };
            throw commentError;
        }
    };

    const deleteComment = async (comment_id: CommentId): Promise<void> => {
        try {
            await apiClient<void>(`/api/video/comments/${comment_id}`, {
                method: 'DELETE',
                data: { comment_id }
            });
        } catch (error) {
            const err = error as Error;
            const commentError: CommentError = {
                message: err?.message || 'Не удалось удалить комментарий',
                status: 500
            };
            throw commentError;
        }
    };

    const getReplies = async (comment_id: CommentId): Promise<Comment[]> => {
        try {
            const data = await apiClient<Comment[]>(`/api/video/comments/${comment_id}/replies`, {
                method: 'GET',
                params: { comment_id },
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            return data;
        } catch (error) {
            const err = error as Error;
            const commentError: CommentError = {
                message: err?.message || 'Не удалось загрузить ответы на комментарий',
                status: 500
            };
            throw commentError;
        }
    };

    // Инвалидация кэша комментариев для видео
    const invalidateCommentsCache = (videoId: VideoId): void => {
        api.invalidateCache(`comments:video:${videoId}`);
    };

    // Очистка всего кэша комментариев
    const clearCommentsCache = (): void => {
        api.invalidateCache('comments:');
    };

    return {
        addComment,
        fetchComments,
        deleteComment,
        getReplies,
        invalidateCommentsCache,
        clearCommentsCache
    };
};
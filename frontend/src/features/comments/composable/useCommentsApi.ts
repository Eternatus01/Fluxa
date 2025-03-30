import { apiClient } from './../../../widgets/apiClient';
import { useApiWithCache } from '../../../shared/composables/useApiWithCache';

export const useCommentsApi = () => {
    // Создаем экземпляр API с кэшированием для комментариев
    const api = useApiWithCache('comments', {
        baseUrl: 'http://localhost:3001',
        defaultCacheOptions: {
            enabled: false, // Отключаем кэширование по умолчанию
            ttl: 0,
            persistent: false
        }
    });

    const addComment = async (videoId: string, userId: string, text: string, parentCommentId?: string): Promise<Comment> => {
        try {
            const data  = await apiClient(`/api/video/${videoId}/comments`, {
                method: 'POST',
                data: { videoId, userId, text, parentCommentId }
            });
            
            // Инвалидируем кэш комментариев для этого видео
            invalidateCommentsCache(videoId);
            
            return data;
        } catch (error) {
            throw error;
        }
    };

    const fetchComments = async (videoId: string): Promise<Comment[]> => {
        try {
            const data  = await apiClient(`/api/video/${videoId}/comments`, {
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
            throw error;
        }
    };

    const deleteComment = async (comment_id: string): Promise<void> => {
        try {
            await apiClient(`/api/video/comments/${comment_id}`, {
                method: 'DELETE',
                data: { comment_id }
            });
        } catch (error) {
            throw error;
        }
    };

    const getReplies = async (comment_id: string): Promise<Comment[]> => {
        try {
            const data  = await apiClient(`/api/video/comments/${comment_id}/replies`, {
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
            throw error;
        }
    };

    // Инвалидация кэша комментариев для видео
    const invalidateCommentsCache = (videoId: string) => {
        api.invalidateCache(`comments:video:${videoId}`);
    };

    // Очистка всего кэша комментариев
    const clearCommentsCache = () => {
        api.clearCacheByPattern('comments:');
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
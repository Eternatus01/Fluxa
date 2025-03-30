import { useApiWithCache } from '../../../shared/composables/useApiWithCache';

export const useReactionApi = () => {
    // Создаем экземпляр API с кэшированием для реакций
    const api = useApiWithCache('reactions', {
        baseUrl: 'http://localhost:3001',
        defaultCacheOptions: {
            enabled: false,
            ttl: 0,
            persistent: false
        }
    });

    const addReaction = async (video_id: string, user_id: string, type: string): Promise<Reaction> => {
        try {
            const { data } = await api.post<{ data: any }>('/api/reactions/video', {
                video_id,
                user_id,
                type
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const addReactionComment = async (comment_id: string, user_id: string, type: string): Promise<Reaction> => {
        try {
            const { data } = await api.post<{ data: any }>('/api/reactions/comment', {
                comment_id,
                user_id,
                type
            });
            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const fetchReactions = async (video_id: string): Promise<ReactionData> => {
        try {
            const data = await api.get<{ data: any }>('/api/reactions/video', {
                video_id
            }, {
                enabled: false
            });
            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const fetchReactionsComment = async (comment_id: string): Promise<ReactionData> => {
        try {
            const { data } = await api.get<{ data: any }>('/api/reactions/comment', {
                comment_id
            }, {
                enabled: false // Всегда получаем свежие данные
            });
            return data.value;
        } catch (error) {
            throw error;
        }
    };


    return {
        addReaction,
        fetchReactions,
        addReactionComment,
        fetchReactionsComment,
    };
};
import { useApiWithCache } from '../../../shared/composables/useApiWithCache';
import {
    Reaction,
    ReactionData,
    VideoId,
    CommentId,
    ReactionType,
    ApiResponse,
    ReactionError
} from '../types';
import { UserId } from '../../user/types/userTypes';

interface ErrorMessage {
    message?: string;
    status?: number;
    field?: string;
    code?: string;
}

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

    const addReaction = async (video_id: VideoId, user_id: UserId, type: ReactionType): Promise<Reaction> => {
        try {
            const { data } = await api.post<ApiResponse<Reaction>>('/api/reactions/video', {
                video_id,
                user_id,
                type
            });

            return data.value.data;
        } catch (error) {
            const err = error as ErrorMessage;
            const reactionError: ReactionError = {
                message: err?.message || 'Не удалось добавить реакцию на видео',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw reactionError;
        }
    };

    const addReactionComment = async (comment_id: CommentId, user_id: UserId, type: ReactionType): Promise<Reaction> => {
        try {
            const { data } = await api.post<ApiResponse<Reaction>>('/api/reactions/comment', {
                comment_id,
                user_id,
                type
            });

            return data.value.data;
        } catch (error) {
            const err = error as ErrorMessage;
            const reactionError: ReactionError = {
                message: err?.message || 'Не удалось добавить реакцию на комментарий',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw reactionError;
        }
    };

    const fetchReactions = async (video_id: VideoId): Promise<ReactionData> => {
        try {
            const { data } = await api.get<ApiResponse<ReactionData>>('/api/reactions/video', {
                video_id
            }, {
                enabled: false
            });

            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            const reactionError: ReactionError = {
                message: err?.message || 'Не удалось получить реакции для видео',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw reactionError;
        }
    };

    const fetchReactionsComment = async (comment_id: CommentId): Promise<ReactionData> => {
        try {
            const { data } = await api.get<ApiResponse<ReactionData>>('/api/reactions/comment', {
                comment_id
            }, {
                enabled: false // Всегда получаем свежие данные
            });

            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            const reactionError: ReactionError = {
                message: err?.message || 'Не удалось получить реакции для комментария',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw reactionError;
        }
    };

    return {
        addReaction,
        fetchReactions,
        addReactionComment,
        fetchReactionsComment,
    };
};
import { useReactionApi } from "../../reactions/composable/useReactionApi";
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
    Reaction,
    VideoId,
    CommentId,
    ReactionType,
    ReactionData,
    ReactionState,
    ReactionError,
    VideoReaction,
    CommentReaction
} from '../types';
import { UserId } from '../../user/types/userTypes';

export const useReactionStore = defineStore("reaction", () => {
    const reactionApi = useReactionApi();

    // Состояние
    const state = ref<ReactionState>({
        videoReactions: {},
        commentReactions: {},
        isLoading: false,
        error: null
    });

    const addReaction = async (video_id: VideoId, user_id: UserId, type: ReactionType): Promise<void> => {
        state.value.isLoading = true;
        state.value.error = null;

        try {
            const reaction = await reactionApi.addReaction(video_id, user_id, type);

            // Обновляем состояние реакций для видео
            await fetchReactions(video_id);

            state.value.isLoading = false;
        } catch (error) {
            state.value.isLoading = false;
            state.value.error = error as ReactionError;
            throw error;
        }
    };

    const addReactionComment = async (comment_id: CommentId, user_id: UserId, type: ReactionType): Promise<void> => {
        state.value.isLoading = true;
        state.value.error = null;

        try {
            const reaction = await reactionApi.addReactionComment(comment_id, user_id, type);

            // Обновляем состояние реакций для комментария
            await fetchReactionsComment(comment_id);

            state.value.isLoading = false;
        } catch (error) {
            state.value.isLoading = false;
            state.value.error = error as ReactionError;
            throw error;
        }
    };

    const fetchReactions = async (video_id: VideoId): Promise<void> => {
        state.value.isLoading = true;
        state.value.error = null;

        try {
            const reactions = await reactionApi.fetchReactions(video_id);

            // Обновляем состояние реакций для видео
            state.value.videoReactions[video_id] = reactions;
            console.log('Updated video reactions state:', state.value.videoReactions[video_id]);

            state.value.isLoading = false;
        } catch (error) {
            state.value.isLoading = false;
            state.value.error = error as ReactionError;
            throw error;
        }
    };

    const fetchReactionsComment = async (comment_id: CommentId): Promise<void> => {
        state.value.isLoading = true;
        state.value.error = null;

        try {
            const reactions = await reactionApi.fetchReactionsComment(comment_id);

            // Обновляем состояние реакций для комментария
            state.value.commentReactions[comment_id] = reactions;

            state.value.isLoading = false;
        } catch (error) {
            state.value.isLoading = false;
            state.value.error = error as ReactionError;
            throw error;
        }
    };

    // Получение реакций для видео
    const getVideoReactions = (video_id: VideoId): ReactionData | null => {
        return state.value.videoReactions[video_id] || null;
    };

    // Получение реакций для комментария
    const getCommentReactions = (comment_id: CommentId): ReactionData | null => {
        return state.value.commentReactions[comment_id] || null;
    };

    // Очистка кэша
    const clearCache = () => {
        state.value.videoReactions = {};
        state.value.commentReactions = {};
        state.value.error = null;
    };

    // Вычисляемые свойства
    const isLoading = computed(() => state.value.isLoading);
    const error = computed(() => state.value.error);

    return {
        // Состояние
        state,
        isLoading,
        error,

        // Методы
        addReaction,
        addReactionComment,
        fetchReactions,
        fetchReactionsComment,
        getVideoReactions,
        getCommentReactions,
        clearCache
    };
});
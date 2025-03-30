import { useReactionApi } from "../composable/useReactionApi";
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useReactionStore = defineStore("reaction", () => {
    const reactionApi = useReactionApi();

    // Реактивные состояния
    const videoReactions = ref<Record<string, ReactionData>>({});
    const commentReactions = ref<Record<string, ReactionData>>({});
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const addReaction = async (video_id: string, user_id: string, type: string): Promise<Reaction | undefined> => {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await reactionApi.addReaction(video_id, user_id, type);

            await fetchReactions(video_id);
            return data.value;
        } catch (err) {
            console.error("Ошибка при добавлении реакции на видео:", err);
            error.value = err as Error;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Добавление реакции на комментарий
    const addReactionComment = async (comment_id: string, user_id: string, type: string): Promise<Reaction | undefined> => {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await reactionApi.addReactionComment(comment_id, user_id, type);

            // Принудительно обновляем данные о реакциях для этого комментария
            await fetchReactionsComment(comment_id);

            return data;
        } catch (err) {
            console.error("Ошибка при добавлении реакции на комментарий:", err);
            error.value = err as Error;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Загрузка реакций для видео
    const fetchReactions = async (video_id: string): Promise<ReactionData | undefined> => {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await reactionApi.fetchReactions(video_id);
            videoReactions.value[video_id] = data;
            return data;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Загрузка реакций для комментария
    const fetchReactionsComment = async (comment_id: string): Promise<ReactionData | undefined> => {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await reactionApi.fetchReactionsComment(comment_id);
            commentReactions.value[comment_id] = data;
            return data;
        } catch (err) {
            error.value = err as Error;
            throw err; // Пробрасываем ошибку дальше для обработки в компоненте
        } finally {
            isLoading.value = false;
        }
    };

    // Получение реакций для видео из локального состояния
    const getVideoReactions = (video_id: string): ReactionData | undefined => {
        return videoReactions.value[video_id];
    };

    // Получение реакций для комментария из локального состояния
    const getCommentReactions = (comment_id: string): ReactionData | undefined => {
        return commentReactions.value[comment_id];
    };

    // Очистка кэша реакций
    const clearCache = () => {
        console.log('Очистка кэша реакций в сторе');
        videoReactions.value = {};
        commentReactions.value = {};
    };

    return {
        // Методы
        addReaction,
        fetchReactions,
        addReactionComment,
        fetchReactionsComment,
        getVideoReactions,
        getCommentReactions,
        clearCache,

        // Состояния
        videoReactions: computed(() => videoReactions.value),
        commentReactions: computed(() => commentReactions.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value)
    };
});
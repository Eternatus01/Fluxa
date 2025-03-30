import { useCommentsApi } from "../composable/useCommentsApi";
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCommentsStore = defineStore("comments", () => {
    const commentsApi = useCommentsApi();
    
    // Реактивные состояния
    const commentsMap = ref<Record<string, Comment[]>>({});
    const repliesMap = ref<Record<string, Comment[]>>({});
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const addComment = async (videoId: string, userId: string, text: string, parentCommentId?: string): Promise<Comment | undefined> => {
        isLoading.value = true;
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
            
            // return data;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchComments = async (video_id: string): Promise<Comment[] | undefined> => {
        isLoading.value = true;
        error.value = null;
        
        try {
            // Очищаем кэш перед запросом
            commentsApi.invalidateCommentsCache(video_id);
            
            const data = await commentsApi.fetchComments(video_id);
            
            // Сохраняем данные в локальное состояние
            commentsMap.value[video_id] = data;
            
            return data;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteComment = async (comment_id: string): Promise<void> => {
        isLoading.value = true;
        error.value = null;
        
        try {
            await commentsApi.deleteComment(comment_id);
            
            // Удаляем ответы на этот комментарий
            delete repliesMap.value[comment_id];
            
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const getReplies = async (comment_id: string): Promise<Comment[] | undefined> => {
        isLoading.value = true;
        error.value = null;
        
        try {
            const data = await commentsApi.getReplies(comment_id);
            
            // Сохраняем данные в локальное состояние
            repliesMap.value[comment_id] = data;
            
            return data;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Очистка кэша комментариев
    const clearCache = () => {
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
        comments: computed(() => commentsMap.value),
        replies: computed(() => repliesMap.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value)
    };
});
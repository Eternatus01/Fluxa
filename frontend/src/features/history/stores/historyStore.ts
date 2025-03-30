import { computed, ref } from 'vue';
import { useHistoryApi } from '../composable/useHistoryApi';
import { defineStore } from 'pinia';

interface HistoryItem {
    video: {
        id: string;
        title: string;
        thumbnail_url: string;
        views: number;
        created_at: string;
        user: {
            channel_name: string;
        }
    };
    viewed_at: string;
}

export const useHistoryStore = defineStore("history", () => {
    const historyApi = useHistoryApi();
    const history = ref<HistoryItem[]>([]);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetchHistory = async (userId: string) => {
        isLoading.value = true;
        error.value = null;

        try {

            const data = await historyApi.fetchHistory(userId);
            const uniqueVideos = new Map<string, HistoryItem>();
            for (const item of data) {
                uniqueVideos.set(item.video.id, item);
            }
            history.value = Array.from(uniqueVideos.values())
                .sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime());

            return history.value;
        } catch (err) {
            error.value = err as Error;
            console.error("История просмотров не загружена:", err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Очистка истории в локальном состоянии
    const clearHistory = () => {
        history.value = [];
    };

    return {
        fetchHistory,
        clearHistory,
        history: computed(() => history.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value)
    };
});
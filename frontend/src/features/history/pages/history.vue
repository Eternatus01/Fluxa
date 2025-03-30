<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { useHistoryStore } from '../stores/historyStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import HistoryList from '../components/HistoryList.vue';

const userStore = useUserStore();
const historyStore = useHistoryStore();

const history = computed(() => historyStore.history);
const user_id = computed(() => userStore.user_id);
const isLoading = computed(() => historyStore.isLoading);
const error = computed(() => historyStore.error);

const fetchHistory = async () => {
    try {
        await historyStore.fetchHistory(user_id.value);
    } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
    }
};

onMounted(async () => {
    if (user_id.value) {
        fetchHistory();
    }
});
</script>

<template>
    <div class="min-h-screen text-white">
        <div class="max-w-screen-2xl mx-auto px-4 py-8">
            <header class="mb-8">
                <h1 class="text-2xl md:text-3xl font-bold text-white">История просмотров</h1>
                <p class="text-gray-400 mt-2 text-sm">Список видео, которые вы недавно смотрели</p>
            </header>

            <LoadingState v-if="isLoading" message="Загрузка истории просмотров..." />

            <ErrorState v-else-if="error"
                :message="error.message || 'Произошла ошибка при загрузке истории просмотров'" />

            <main v-else class="pb-10">
                <HistoryList :history="history" />
            </main>
        </div>
    </div>
</template>
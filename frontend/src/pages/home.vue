<template>
    <main class="flex min-h-screen">
        <Sidebar />
        <section class="flex-1 px-4">
            <div v-if="searchQuery" class="mt-6 mb-4">
                <h2 class="text-xl font-semibold text-white/90">
                    Результаты поиска для "{{ searchQuery }}"
                </h2>
            </div>
            <VideoGrid :videos="videos" :is-loading="isLoading" :error="error" />
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '../features/video/stores/videoStore';
import Sidebar from '../features/navigation/components/Sidebar.vue';
import VideoGrid from '../features/video/components/VideoGrid.vue';

type CustomError = {
    message: string;
    name?: string;
};

const route = useRoute();
const videoStore = useVideoStore();
const videos = computed(() => videoStore.videos || []);
const isLoading = ref(true);
const error = ref<CustomError | null>(null);
const searchQuery = computed(() => route.query.search as string);

// Функция для загрузки видео
const loadVideos = async (query?: string) => {
    try {
        isLoading.value = true;
        error.value = null;

        if (query) {
            await videoStore.searchVideos(query);
        } else {
            await videoStore.fetchVideos();
        }
    } catch (err) {
        error.value = err as CustomError;
        console.error(err);
    } finally {
        isLoading.value = false;
    }
};

// Следим за изменениями параметра поиска в URL
watch(() => route.query.search, (newQuery) => {
    loadVideos(newQuery as string);
}, { immediate: true });

onMounted(async () => {
    if (!searchQuery.value) {
        await loadVideos();
    }
});
</script>
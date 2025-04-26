<template>
    <div class="search-results">
        <!-- Информация о результатах поиска -->
        <div class="mb-6">
            <h2 class="text-2xl font-semibold text-white/90">
                Результаты поиска для "{{ searchQuery }}"
            </h2>
            <p class="text-white/60 mt-1">
                Найдено: {{ displayedVideos?.length || 0 }} видео
            </p>
        </div>

        <!-- Отображение результатов -->
        <div v-if="isLoading" class="flex justify-center py-10">
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="displayedVideos && displayedVideos.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <VideoCard v-for="video in displayedVideos" :key="video.id" :video="video" />
        </div>

        <!-- Если ничего не найдено -->
        <div v-else-if="!isLoading && (!displayedVideos || displayedVideos.length === 0)"
            class="flex flex-col items-center py-16">
            <i class="i-carbon-search-no-results text-5xl text-white/40 mb-4"></i>
            <h3 class="text-xl font-medium text-white/90 mb-2">Ничего не найдено</h3>
            <p class="text-white/60 text-center max-w-md">
                По запросу "{{ searchQuery }}" ничего не найдено. Попробуйте изменить поисковый запрос или использовать
                другие ключевые слова.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '@/features/video/stores/videoStore';
import { useUiStore } from '@/shared/stores/uiStore';
import VideoCard from '@/features/video/components/VideoCard.vue';
import type { Video } from '@/features/video/types/videoTypes';

const route = useRoute();
const videoStore = useVideoStore();
const uiStore = useUiStore();

const searchQuery = computed(() => route.query.q as string);
const isLoading = computed(() => uiStore.isLoading);
const searchResults = ref<Video[]>([]);

// Используем локальное состояние для отображения результатов
const displayedVideos = computed(() => {
    console.log('Вычисляем displayedVideos, searchResults:', searchResults.value);
    return searchResults.value;
});

// Функция для выполнения поиска
const performSearch = async () => {
    if (!searchQuery.value) return;

    try {
        console.log('Выполняем поиск по запросу:', searchQuery.value);
        const results = await videoStore.searchVideos(searchQuery.value);
        console.log('Результаты поиска:', results);

        if (results && Array.isArray(results)) {
            searchResults.value = results;
        }
    } catch (error) {
        console.error('Ошибка при поиске видео:', error);
        searchResults.value = [];
    }
};

// Выполняем поиск при изменении запроса
watch(() => searchQuery.value, () => {
    performSearch();
});

// Выполняем поиск при монтировании компонента
onMounted(() => {
    console.log('Компонент search.vue смонтирован, запрос:', searchQuery.value);
    performSearch();
});
</script>
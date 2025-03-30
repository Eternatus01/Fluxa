<script setup lang="ts">
import type { Video } from '../types/videoTypes';
import VideoCard from '@/shared/ui/organisms/VideoCard.vue';

type CustomError = {
    message: string;
    name?: string;
};

defineProps<{
    videos: Video[];
    isLoading?: boolean;
    error?: CustomError | null;
}>();
</script>

<template>
    <div class="min-h-screen">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center min-h-[50vh] animate-pulse">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6 w-full">
                <div v-for="i in 10" :key="i" class="flex flex-col bg-dark-200 rounded-xl overflow-hidden">
                    <div class="aspect-video bg-dark-300"></div>
                    <div class="p-4 flex gap-3">
                        <div class="w-10 h-10 rounded-full bg-dark-300"></div>
                        <div class="flex-1">
                            <div class="h-4 bg-dark-300 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-dark-300 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
            <div class="w-24 h-24 mb-6 text-white/20">
                <i class="i-carbon-warning-alt text-6xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-white/90 mb-2">Что-то пошло не так</h3>
            <p class="text-white/60 max-w-md">{{ error.message }}</p>
        </div>

        <!-- Content -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
            <VideoCard v-for="video in videos" :key="video.id" :video="video" />
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && !error && videos.length === 0"
            class="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
            <div class="w-24 h-24 mb-6 text-white/20">
                <i class="i-carbon-video-off text-6xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-white/90 mb-2">Видео не найдены</h3>
            <p class="text-white/60">Попробуйте изменить параметры поиска или вернитесь позже</p>
        </div>
    </div>
</template>
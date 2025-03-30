<script setup lang="ts">
import type { Video } from '../../types/videoTypes';
import { computed } from 'vue';

const props = defineProps<{
    video: Video;
}>();

// Вычисляемое свойство для определения типа видео
const videoVisibility = computed(() => {
    // Используем только свойство videoType, так как поля type в интерфейсе Video нет
    return props.video.videoType || 'public';
});

// Проверка типа видео
const isPublic = computed(() => videoVisibility.value === 'public');
const isPrivate = computed(() => videoVisibility.value === 'private');
const isLinkOnly = computed(() => videoVisibility.value === 'link');
</script>

<template>
    <section class="bg-[#1e1e1e]/60 rounded-lg p-6 md:p-8 shadow-lg sticky top-4">
        <h2 class="text-lg font-semibold mb-6 text-white pb-2 border-b border-gray-700/50">Предпросмотр</h2>

        <div class="space-y-5">
            <!-- Превью видео -->
            <div class="aspect-video bg-black/40 rounded-lg overflow-hidden">
                <video v-if="video.video_url" :src="video.video_url" controls class="w-full h-full"></video>
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <span>Превью видео</span>
                </div>
            </div>

            <!-- Информация о видео -->
            <div class="pt-3">
                <router-link :to="{ name: 'Watch', params: { id: video.id } }"
                    class="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Открыть страницу видео
                </router-link>
                <h3 class="text-lg font-medium text-white leading-tight mb-3">{{ video.title || 'Название видео' }}</h3>
                <div class="text-sm text-gray-300 mb-4 max-h-32 overflow-y-auto video-description">
                    {{ video.description || 'Описание видео' }}
                </div>

                <!-- Теги -->
                <div v-if="video.tags?.length" class="mt-4">
                    <h4 class="text-sm font-medium text-gray-400 mb-2">Теги:</h4>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="(tag, index) in video.tags" :key="index"
                            class="bg-[#252525] text-blue-400 inline-flex items-center px-3 py-1 rounded-full text-xs hover:bg-[#303030] transition-colors">
                            #{{ tag }}
                        </span>
                    </div>
                </div>

                <!-- Видимость -->
                <div class="mt-4 py-3 px-4 bg-[#252525]/70 rounded-lg">
                    <div class="flex items-center gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path v-if="isPublic" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path v-if="isPublic" fill-rule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clip-rule="evenodd" />
                            <path v-if="isPrivate" fill-rule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clip-rule="evenodd" />
                            <path v-if="isLinkOnly"
                                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                        </svg>
                        <div>
                            <span class="text-gray-200 font-medium">
                                {{ isPublic ? 'Публичное видео' :
                                    isPrivate ? 'Приватное видео' : 'Доступ по ссылке' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
.video-description {
    white-space: pre-line;
}
</style>
<script setup lang="ts">
import type { Video } from '../../types/videoTypes';

defineProps<{
    video: Video;
}>();
</script>

<template>
    <section class="bg-gray-800 rounded-xl p-6 shadow-2xl sticky top-4">
        <h2 class="text-xl font-semibold mb-6">Предпросмотр</h2>

        <div class="space-y-4">
            <!-- Превью видео -->
            <div class="aspect-video bg-black rounded-lg overflow-hidden">
                <video v-if="video.video_url" :src="video.video_url" controls class="w-full h-full"></video>
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <span>Превью видео</span>
                </div>
            </div>

            <!-- Превью информации -->
            <div>
                <h3 class="text-blue-500">
                    <router-link :to="{ name: 'Watch', params: { id: video.id } }">
                        Ссылка на видео
                    </router-link>
                </h3>
                <h3 class="text-lg font-semibold">{{ video.title || 'Название видео' }}</h3>
                <p class="text-sm mt-1 video-description">
                    {{ video.description || 'Описание видео' }}
                </p>
                <div v-if="video.tags?.length" class="mb-6">
                    <h3 class="text-lg font-semibold mb-2">Теги видео:</h3>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="(tag, index) in video.tags" :key="index"
                            class="text-gray-900 inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-300 transition-colors cursor-pointer">
                            #{{ tag }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
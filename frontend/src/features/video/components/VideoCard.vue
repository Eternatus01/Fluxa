<template>
    <router-link :to="`/watch/${video.id}`" class="group block transition-all duration-300">
        <div class="relative aspect-video overflow-hidden">
            <img :src="video.thumbnail_url" :alt="video.title"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 rounded-lg" />

            <div v-if="video.duration"
                class="absolute bottom-2 right-2 px-1 py-0.5 bg-black/70 text-white/90 text-xs font-medium rounded">
                {{ formatDuration(video.duration) }}
            </div>
        </div>

        <div class="flex gap-2 p-2 py-4">
            <div class="relative">
                <router-link :to="`/channel/${video.user_id}`">
                    <img :src="avatarUrl" :alt="channelName"
                        class="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-primary-500" />
                </router-link>
            </div>

            <div class="flex-1 min-w-0">
                <h3
                    class="font-normal text-[15px] text-white line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors duration-300">
                    {{ video.title }}
                </h3>
                <div class="flex flex-col gap-0.5">
                    <router-link :to="`/channel/${video.user_id}`"
                        class="text-xs text-gray-400 truncate hover:text-white/80">
                        {{ channelName }}
                    </router-link>
                    <div class="flex items-center text-[11px] text-gray-400 gap-2">
                        <span>{{ formattedViews }}</span>
                        <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span>{{ formattedDate }}</span>
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { Video } from '@/features/video/types/videoTypes';
import { formatViews, timeAgo } from '@/shared/lib/formatters';

const props = defineProps<{
    video: Video;
}>();

// При монтировании компонента проверяем данные видео
onMounted(() => {
    console.log('VideoCard mounted with video:', props.video);
});

const formattedViews = computed(() => formatViews(props.video.views || 0));
const formattedDate = computed(() => timeAgo(props.video.created_at));

// Получаем данные из видео
const avatarUrl = computed(() => props.video.avatar_url || '/default-avatar.jpg');
const channelName = computed(() => props.video.channel_name || 'Неизвестный канал');

// Форматирование длительности видео в формат MM:SS
const formatDuration = (seconds: number): string => {
    if (!seconds) return '';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.scale-102 {
    transform: scale(1.02);
}
</style>
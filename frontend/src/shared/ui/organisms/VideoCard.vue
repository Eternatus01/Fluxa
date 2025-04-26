<template>
    <router-link :to="`/watch/${video.id}`" class="group block transition-all duration-300">
        <div class="relative aspect-video overflow-hidden">
            <img :src="video.thumbnail_url" :alt="video.title"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 rounded-lg" />

            <div class="absolute bottom-2 right-2 text-white/80 text-xs font-medium">
                10:24
            </div>
        </div>

        <div class="flex gap-2 p-2 py-4">
            <div class="relative">
                <img :src="avatarUrl" :alt="channelName" class="w-8 h-8 rounded-full object-cover" />
            </div>

            <div class="flex-1 min-w-0">
                <h3
                    class="font-normal text-[15px] text-white line-clamp-2 leading-tight mb-1 group-hover:text-red-400 transition-colors duration-300">
                    {{ video.title }}
                </h3>
                <div class="flex flex-col gap-0.5">
                    <p class="text-xs text-gray-400 truncate">{{ channelName }}</p>
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
import { computed } from 'vue';
import type { Video } from '@/features/video/types/videoTypes';
import { formatViews, timeAgo } from '@/shared/lib/formatters';

const props = defineProps<{
    video: Video;
}>();

const formattedViews = computed(() => formatViews(props.video.views));
const formattedDate = computed(() => timeAgo(props.video.created_at));

// Получаем данные из видео
const avatarUrl = computed(() => props.video.avatar_url || '/default-avatar.jpg');
const channelName = computed(() => props.video.channel_name || 'Неизвестный канал');
</script>

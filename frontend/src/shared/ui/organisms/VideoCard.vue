<template>
    <router-link :to="`/watch/${video.id}`"
        class="group block bg-[#1e1e1e]/60 rounded-lg overflow-hidden hover:bg-[#252525]/70 transition-all duration-300">
        <div class="relative aspect-video overflow-hidden">
            <img :src="video.thumbnail_url" :alt="video.title"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:filter group-hover:brightness-110" />

            <div
                class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <div
                class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-[2px] text-white px-2 py-0.5 rounded-md text-xs font-medium shadow-sm">
                10:24
            </div>
        </div>

        <div class="flex gap-3 p-3">
            <div class="relative">
                <img :src="avatarUrl" :alt="channelName"
                    class="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300" />
            </div>

            <div class="flex-1 min-w-0">
                <h3
                    class="font-medium text-sm text-white line-clamp-2 leading-tight mb-1.5 group-hover:text-blue-400 transition-colors duration-300">
                    {{ video.title }}
                </h3>

                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-300 truncate group-hover:text-gray-200 transition-colors duration-300">
                        {{ channelName }}
                    </p>

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

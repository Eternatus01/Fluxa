<template>
    <router-link :to="`/watch/${video.id}`"
        class="group bg-dark-200 rounded-xl overflow-hidden hover:bg-dark-300 transition-all duration-300">
        <div class="relative aspect-video overflow-hidden">
            <img :src="video.thumbnail_url" :alt="video.title"
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />

        </div>
        <div class="py-4">
            <div class="flex gap-3">
                <div class="flex-shrink-0">
                    <img :src="video.avatar_url" :alt="video.channel_name"
                        class="w-10 h-10 rounded-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-white font-medium leading-snug mb-1 truncate group-hover:text-primary-400">
                        {{ video.title }}
                    </h3>
                    <p class="text-gray-400 text-sm truncate">{{ video.channel_name }}</p>
                    <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>{{ formattedViews }}</span>
                        <span>•</span>
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
</script>

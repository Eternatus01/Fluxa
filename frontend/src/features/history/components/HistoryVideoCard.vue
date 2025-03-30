<template>
    <router-link :to="getUrl(item.video.id)"
        class="group block bg-[#1e1e1e]/60 rounded-lg overflow-hidden hover:bg-[#252525]/70 transition-all duration-300">
        <!-- Thumbnail with overlay -->
        <div class="relative aspect-video overflow-hidden">
            <img :src="item.video.thumbnail_url" :alt="item.video.title"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:filter group-hover:brightness-110" />

            <div
                class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-[2px] text-white px-2 py-0.5 rounded-md text-xs font-medium shadow-sm">
                10:24
            </div>
        </div>

        <div class="flex gap-3 p-3">
            <div class="relative">
                <img :src="item.video.user.avatar_url"
                    class="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300" />
            </div>

            <div class="flex-1 min-w-0">
                <h3
                    class="font-medium text-sm text-white line-clamp-2 leading-tight mb-1.5 group-hover:text-blue-400 transition-colors duration-300">
                    {{ item.video.title }}
                </h3>

                <div class="flex flex-col gap-1">
                    <p class="text-xs text-gray-300 truncate group-hover:text-gray-200 transition-colors duration-300">
                        {{ item.video.user.channel_name }}
                    </p>

                    <div class="flex items-center text-[11px] text-gray-400 gap-2">
                        <span>{{ formattedViews }}</span>
                        <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span>{{ formattedDate }}</span>
                    </div>

                    <div class="text-[11px] text-gray-500 mt-0.5">
                        Просмотрено: {{ timeAgo(item.watched_at) }}
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import { timeAgo } from '@/widgets/timeAgo';
import type { HistoryItem } from '../types';
import { computed } from 'vue';
import { formatViews } from '@/shared/lib/formatters';

const props = defineProps<{
    item: HistoryItem;
}>();

const formattedViews = computed(() => formatViews(props.item.video.views));
const formattedDate = computed(() => timeAgo(props.item.video.created_at));

const getUrl = (video_id: string) => {
    return { name: 'Watch', params: { id: video_id } };
};
</script>
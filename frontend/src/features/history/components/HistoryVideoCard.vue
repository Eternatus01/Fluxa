<template>
    <router-link :to="getUrl(item.video.id)" class="group bg-dark-200 rounded-xl overflow-hidden hover:bg-dark-300 transition-all duration-300">
        <div class="rounded-lg shadow">
            <div class="relative aspect-video overflow-hidden">
                <img :src="item.video.thumbnail_url"
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    alt="Video Thumbnail">
            </div>
            <div class="py-4">
                <div class="flex gap-3">
                    <img v-if="item.video.user.avatar_url" :src="item.video.user.avatar_url"
                        class="w-10 h-10 rounded-full object-cover" alt="Channel Avatar">
                    <div>
                        <h3 class="text-white font-medium leading-snug mb-1 truncate group-hover:text-primary-400">{{
                            item.video.title }}</h3>
                        <p class="text-gray-400 text-sm truncate">{{ item.video.user.channel_name }}</p>
                        <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{{ formattedViews }}</span>
                            <span>•</span>
                            <span>{{ formattedDate }}</span>
                        </div>
                        <p class="text-gray-500 text-xs mt-1">
                            Просмотрено: {{ timeAgo(item.watched_at) }}
                        </p>
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
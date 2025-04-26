<template>
    <router-link :to="getUrl(item.video.id)"
        class="group block rounded-lg overflow-hidden hover:bg-[#252525]/30 transition-all duration-300">
        <!-- Thumbnail с оверлеем -->
        <div class="relative aspect-video overflow-hidden">
            <img :src="item.video.thumbnail_url" :alt="item.video.title"
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 rounded-lg" />

            <div
                class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <!-- Длительность видео -->
            <div v-if="item.video.duration"
                class="absolute bottom-2 right-2 px-1 py-0.5 bg-black/70 text-white/90 text-xs font-medium rounded">
                {{ formatDuration(item.video.duration) }}
            </div>

            <!-- Метка времени просмотра -->
            <div class="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 text-xs rounded-md font-medium">
                Просмотрено: {{ timeAgo(item.watched_at) }}
            </div>
        </div>

        <div class="flex gap-3 p-3">
            <div class="relative">
                <router-link :to="`/channel/${item.video.user_id}`">
                    <img :src="avatarUrl" :alt="channelName"
                        class="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-blue-500" />
                </router-link>
            </div>

            <div class="flex-1 min-w-0">
                <h3
                    class="font-normal text-[15px] text-white line-clamp-2 leading-tight mb-1 group-hover:text-blue-400 transition-colors duration-300">
                    {{ item.video.title }}
                </h3>
                <div class="flex flex-col gap-0.5">
                    <router-link :to="`/channel/${item.video.user_id}`"
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
import { timeAgo } from '@/widgets/timeAgo';
import { computed } from 'vue';
import { formatViews } from '@/shared/lib/formatters';

// Определяем интерфейс для элемента истории
interface HistoryItem {
    video: {
        id: string;
        title: string;
        thumbnail_url: string;
        views: number;
        created_at: string;
        duration?: number;
        user_id: string;
        user: {
            channel_name: string;
            avatar_url?: string;
        }
    };
    watched_at: string;
}

const props = defineProps<{
    item: HistoryItem;
}>();

const formattedViews = computed(() => formatViews(props.item.video.views || 0));
const formattedDate = computed(() => timeAgo(props.item.video.created_at));

// Получаем данные из видео
const avatarUrl = computed(() => props.item.video.user.avatar_url || '/default-avatar.jpg');
const channelName = computed(() => props.item.video.user.channel_name || 'Неизвестный канал');

// Форматирование длительности видео в формат MM:SS
const formatDuration = (seconds: number): string => {
    if (!seconds) return '';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getUrl = (video_id: string) => {
    return { name: 'Watch', params: { id: video_id } };
};
</script>

<style scoped>
.scale-102 {
    transform: scale(1.02);
}
</style>
<script setup lang="ts">
import { computed } from 'vue';
import type { Playlist } from '@/features/video/types';
import PlaylistCard from './PlaylistCard.vue';

const props = defineProps<{
    playlists: Playlist[] | null;
}>();

// Вычисляемое свойство для отслеживания наличия плейлистов
const hasPlaylists = computed(() => {
    return props.playlists && props.playlists.length > 0;
});
</script>

<template>
    <div v-if="hasPlaylists" class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        <PlaylistCard v-for="(playlist, index) in playlists" :key="playlist.id" :playlist="playlist"
            :style="{ 'animation-delay': `${index * 0.05}s` }" class="playlist-card" />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 mb-4 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" class="w-full h-full">
                <path d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
        </div>
        <p class="text-gray-400 text-lg">У вас пока нет плейлистов</p>
    </div>
</template>

<style scoped>
.playlist-card {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
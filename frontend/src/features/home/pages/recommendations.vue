<template>
    <div>
        <VideoGrid :videos="videos" :error="error" />
    </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue';
import { useVideoStore } from '../../video/stores/videoStore';
import VideoGrid from '../../video/components/VideoGrid.vue';

const videoStore = useVideoStore();
const videos = computed(() => videoStore.videos || []);
const error = computed(() => videoStore.error);

// Функция загрузки видео
const loadVideos = async () => {
    try {
        await videoStore.fetchVideos();

    } catch (err) {
        console.error('Ошибка при загрузке видео:', err);
    }
};
onMounted(() => {
    loadVideos();
});
</script>

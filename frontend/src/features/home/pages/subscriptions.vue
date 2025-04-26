<template>
    <VideoGrid :videos="videos" :error=" error" />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '../../video/stores/videoStore';
import VideoGrid from '../../video/components/VideoGrid.vue';
import { useUiStore } from '@/shared/stores/uiStore';
import { useUserStore } from '@/features/user/stores/userStore';

const route = useRoute();
const videoStore = useVideoStore();
const uiStore = useUiStore();
const userStore = useUserStore();
const videos = computed(() => videoStore.videos || []);
const error = computed(() => videoStore.error);
const searchQuery = computed(() => route.query.search as string);

const loadVideos = async () => {
    try {
        uiStore.isLoading = true;

        if (searchQuery.value) {
            await videoStore.searchVideos(searchQuery.value);
        } else {
            await videoStore.fetchSubscribedVideos(userStore.user_id);
        }
    } catch (err) {
        console.error(err);
    } finally {
        uiStore.isLoading = false;
    }
};

// Следим за изменением маршрута и поискового запроса
watch([() => route.path, () => searchQuery.value], () => {
    loadVideos();
}, { immediate: true });
</script>

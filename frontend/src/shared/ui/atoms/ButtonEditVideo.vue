<template>
    <router-link :to="{ name: 'VideoControl', params: { video_id } }"
        class=" bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer"
        v-if="userStore.user_id === user_id">
        Управление видео
    </router-link>
</template>

<script setup lang="ts">
import { useUserStore } from './../../../features/user/stores/userStore';

const userStore = useUserStore();

defineProps<{
    user_id: string;
    video_id: string;
}>();
</script>
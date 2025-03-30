<template>
    <div class="flex items-center absolute top-8 left-8">
        <img :src="user.avatar_url || '/default-avatar.jpg'" class="w-28 h-28 rounded-lg object-cover"
            alt="Channel Avatar">
        <div class="ml-4">
            <h1 class="text-5xl mb-2 font-semibold z-10">{{ user.channel_name }}</h1>
            <h1 class="text-sm mb-2 z-10">@{{ user.username }}</h1>
            <p class="text-sm text-gray-300">
                {{ formatSubscribersCount(user.subscribers_count) }} подписчиков •
                {{ videoCount }} видео
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useVideoStore } from '../../video/stores/videoStore';

const videoStore = useVideoStore();

const props = defineProps<{
    user: UserData,
}>();

const videoCount = computed(() => {
    return videoStore.videosUser?.length || 0;
});

// Функция для форматирования числа подписчиков
const formatSubscribersCount = (count: number | undefined) => {
    if (!count) return 0;

    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }

    return count;
};
</script>

<style scoped></style>
<template>
    <div class="channel-info-container">
        <div class="avatar-wrapper">
            <img :src="user.avatar_url || '/default-avatar.jpg'" class="channel-avatar" alt="Channel Avatar">
        </div>
        <div class="channel-details">
            <h1 class="channel-name">{{ user.channel_name }}</h1>
            <h2 class="channel-username">@{{ user.username }}</h2>
            <div class="channel-stats">
                <div class="stat-item">
                    <span class="stat-value">{{ formatSubscribersCount(user.subscribers_count) }}</span>
                    <span class="stat-label">подписчиков</span>
                </div>
                <div class="stat-separator"></div>
                <div class="stat-item">
                    <span class="stat-value">{{ videoCount }}</span>
                    <span class="stat-label">видео</span>
                </div>
            </div>
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

<style scoped>
.channel-info-container {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    animation: slideUp 0.6s ease-out 0.2s both;
}

.avatar-wrapper {
    position: relative;
    flex-shrink: 0;
    margin-right: 1.5rem;
}

.channel-avatar {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}

.channel-avatar:hover {
    transform: scale(1.05);
    border-color: rgba(59, 130, 246, 0.5);
}

.channel-details {
    display: flex;
    flex-direction: column;
}

.channel-name {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: white;
}

.channel-username {
    font-size: 0.9375rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.75rem;
}

.channel-stats {
    display: flex;
    align-items: center;
}

.stat-item {
    display: flex;
    align-items: center;
}

.stat-value {
    font-weight: 600;
    color: white;
    margin-right: 0.25rem;
}

.stat-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
}

.stat-separator {
    width: 0.25rem;
    height: 0.25rem;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    margin: 0 0.75rem;
}

@keyframes slideUp {
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
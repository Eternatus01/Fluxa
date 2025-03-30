<template>
    <div class="channel-page">
        <LoadingState v-if="isLoading" message="Загрузка данных канала..." />

        <ErrorState v-else-if="error" :message="error" />

        <template v-else>
            <ChannelHeader v-if="user" :user="user" />
            <main class="channel-content">
                <NavBar />
                <div v-if="videos && videos.length > 0" class="videos-grid">
                    <VideoCard v-for="(video, index) in videos" :key="video.id" :video="video"
                        :style="{ 'animation-delay': `${0.1 + index * 0.05}s` }" class="video-card-animate" />
                </div>
                <div v-else class="empty-state">
                    <div class="empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                            <line x1="7" y1="2" x2="7" y2="22"></line>
                            <line x1="17" y1="2" x2="17" y2="22"></line>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <line x1="2" y1="7" x2="7" y2="7"></line>
                            <line x1="2" y1="17" x2="7" y2="17"></line>
                            <line x1="17" y1="17" x2="22" y2="17"></line>
                            <line x1="17" y1="7" x2="22" y2="7"></line>
                        </svg>
                    </div>
                    <p class="empty-text">На этом канале пока нет видео</p>
                </div>
            </main>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/features/user/stores/userStore';
import { useVideoStore } from '@/features/video/stores/videoStore';
import ChannelHeader from '../components/ChannelHeader.vue';
import VideoCard from '@/shared/ui/organisms/VideoCard.vue';
import NavBar from '../components/Navbar.vue';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import type { UserData } from '@/features/user/types/userTypes';

const route = useRoute();
const userStore = useUserStore();
const videoStore = useVideoStore();

const user = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Используем computed для получения видео из стора
const videos = computed(() => videoStore.videosUser);

// Функция для загрузки данных пользователя и его видео
const loadUserData = async (username: string) => {
    isLoading.value = true;
    error.value = null;

    try {
        if (!username) {
            error.value = 'Имя пользователя не указано';
            return;
        }

        const userData = await userStore.getUserByUsername(username);

        if (!userData) {
            error.value = 'Канал не найден';
            return;
        }

        user.value = userData;

        if (userData.id) {
            await videoStore.fetchUserVideos(userData.id);
        }
    } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        error.value = 'Произошла ошибка при загрузке данных канала';
    } finally {
        isLoading.value = false;
    }
};

// Следим за изменением имени пользователя в URL
watch(
    () => route.params.username,
    async (newUsername) => {
        if (newUsername) {
            await loadUserData(newUsername as string);
        }
    }
);

// При монтировании компонента загружаем данные пользователя
onMounted(() => {
    const username = route.params.username as string;
    if (username) {
        loadUserData(username);
    }
});
</script>

<style scoped>
.channel-page {
    min-height: 100vh;
    background-color: #0f0f0f;
}

.channel-content {
    padding: 0 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
}

.videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem 0 3rem;
}

.video-card-animate {
    opacity: 0;
    animation: cardFadeIn 0.5s ease-out forwards;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    color: rgba(255, 255, 255, 0.6);
    animation: fadeIn 0.8s ease-out;
}

.empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
    opacity: 0.4;
}

.empty-text {
    font-size: 1.25rem;
    font-weight: 500;
}

@keyframes cardFadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@media (min-width: 1200px) {
    .videos-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 1600px) {
    .videos-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
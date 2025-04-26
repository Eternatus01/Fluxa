<template>
    <div class="channel-page">
        <ErrorState v-if="error" :message="error" />

        <template v-else>
            <ChannelHeader v-if="user" :user="user" />
            <NavBar />
            <main class="channel-content">
                <router-view />
            </main>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/features/user/stores/userStore';
import { useVideoStore } from '@/features/video/stores/videoStore';
import ChannelHeader from '../components/ChannelHeader.vue';
import NavBar from '../components/Navbar.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import { useUiStore } from '@/shared/stores/uiStore';

const route = useRoute();
const userStore = useUserStore();
const videoStore = useVideoStore();
const uiStore = useUiStore();

const user = ref<any>(null);
const error = ref<string | null>(null);

// Функция для загрузки данных пользователя и его видео
const loadUserData = async (username: string) => {
    uiStore.isLoading = true;
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
        uiStore.isLoading = false;
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
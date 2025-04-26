<template>
    <div>
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
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useVideoStore } from '@/features/video/stores/videoStore';
import VideoCard from '@/shared/ui/organisms/VideoCard.vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/features/user/stores/userStore';

const videoStore = useVideoStore();
const videos = computed(() => videoStore.videosUser);
const route = useRoute();
const userStore = useUserStore();
const username = ref<string | null>(route.params.username as string);

const user = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
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

// При монтировании компонента загружаем данные пользователя
onMounted(() => {
    if (username.value) {
        loadUserData(username.value);
    }
});

watch(
    () => route.params.username,
    async (newUsername) => {
        if (newUsername) {
            await loadUserData(newUsername as string);
        }
    }
);
</script>

<style scoped>
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
</style>
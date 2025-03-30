<template>
    <div class="min-h-screen">
        <LoadingState v-if="isLoading" message="Загрузка данных канала..." />

        <ErrorState v-else-if="error" :message="error" />

        <template v-else>
            <ChannelHeader v-if="user" :user="user" />
            <main class="pt-4 container mx-auto">
                <NavBar class="pb-4" />
                <div v-if="videos && videos.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                    <VideoCard v-for="video in videos" :key="video.id" :video="video" />
                </div>
                <div v-else class="text-center py-10">
                    <p class="text-gray-400 text-xl">На этом канале пока нет видео</p>
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

const route = useRoute();
const userStore = useUserStore();
const videoStore = useVideoStore();

const user = ref<UserData | null>(null);
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

<style scoped></style>
<template>
    <div class="min-h-screen ">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-2xl font-bold text-white mb-8">Мои плейлисты</h1>

            <!-- Сетка с плейлистами + карточка добавления -->
            <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                <!-- Карточка "Создать плейлист" -->
                <div @click="createPlaylist"
                    class="bg-[#1e1e1e] cursor-pointer group rounded-lg overflow-hidden flex flex-col items-center justify-center min-h-[240px] border-2 border-dashed border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-[1.02]">
                    <div class="flex flex-col items-center text-center p-6">
                        <div
                            class="w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3
                            class="text-xl font-medium text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
                            Создать плейлист</h3>
                        <p class="text-gray-400 text-sm">Соберите свою коллекцию видео в новый плейлист</p>
                    </div>
                </div>

                <!-- Список плейлистов -->
                <template v-if="uiStore.isLoading">
                    <div class="col-span-full">
                        <LoadingState message="Загрузка плейлистов..." />
                    </div>
                </template>
                <template v-else-if="error">
                    <div class="col-span-full">
                        <ErrorState :message="error.message" />
                    </div>
                </template>
                <template v-else>
                    <PlaylistCard v-for="(playlist, index) in allPlaylists" :key="playlist.id" :playlist="playlist"
                        :show-subscribe="playlist.user_id !== userId && !playlist.is_own"
                        :is-subscribed="playlist.is_subscribed" :style="{ 'animation-delay': `${index * 0.05}s` }"
                        class="playlist-card" @subscribe="handleSubscribe(playlist.id)"
                        @unsubscribe="handleUnsubscribe(playlist.id)" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { usePlaylistStore } from '../stores/playlistStore';
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import PlaylistCard from '../components/PlaylistCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const playlistStore = usePlaylistStore();
const uiStore = useUiStore();
const dataLoaded = ref(false);

const userId = computed(() => userStore.user_id);
const error = computed(() => playlistStore.error);
const allPlaylists = computed(() => playlistStore.allUserPlaylists);

const fetchPlaylists = async () => {
    if (userId.value && !dataLoaded.value) {
        uiStore.isLoading = true;
        await playlistStore.fetchAllUserPlaylists(userId.value);
        uiStore.isLoading = false;
        dataLoaded.value = true;
    }
};

const createPlaylist = () => {
    router.push({ name: 'CreatePlaylist' });
};

const handleSubscribe = async (playlistId: string) => {
    if (!userId.value) return;

    try {
        await playlistStore.subscribeToPlaylist(userId.value, playlistId);
        // Обновляем список всех плейлистов после подписки
        await playlistStore.fetchAllUserPlaylists(userId.value);
    } catch (err) {
        console.error(`Ошибка при подписке на плейлист ${playlistId}:`, err);
    }
};

const handleUnsubscribe = async (playlistId: string) => {
    if (!userId.value) return;

    try {
        await playlistStore.unsubscribeFromPlaylist(userId.value, playlistId);
        // Обновляем список всех плейлистов после отписки
        await playlistStore.fetchAllUserPlaylists(userId.value);
    } catch (err) {
        console.error(`Ошибка при отписке от плейлиста ${playlistId}:`, err);
    }
};

// При возвращении на эту страницу, обновляем список плейлистов
onMounted(() => {
    fetchPlaylists();
});
</script>

<style scoped>
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.playlist-card {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}
</style>

<template>
    <div class="min-h-screen">
        <div class=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-2xl font-bold text-white mb-8">Все плейлисты пользователей</h1>

            <!-- Сортировка -->
            <div class="flex items-center mb-6 gap-4">
                <label class="text-white">Сортировать по:</label>
                <select v-model="sortBy" class="bg-gray-800 text-white rounded px-3 py-1 border border-gray-700">
                    <option value="created_at">Дате создания</option>
                    <option value="video_count">Количеству видео</option>
                    <option value="title">Алфавиту</option>
                </select>
            </div>

            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
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
                    <PlaylistCard v-for="(playlist, index) in sortedPlaylists" :key="playlist.id" :playlist="playlist"
                        :show-subscribe="playlist.user_id !== userId" :is-subscribed="subscriptionStatus[playlist.id]"
                        :style="{ 'animation-delay': `${index * 0.05}s` }" class="playlist-card"
                        @subscribe="handleSubscribe(playlist.id)" @unsubscribe="handleUnsubscribe(playlist.id)" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { usePlaylistStore } from '@/features/playlist/stores/playlistStore';
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import PlaylistCard from '@/features/playlist/components/PlaylistCard.vue';

const userStore = useUserStore();
const playlistStore = usePlaylistStore();
const uiStore = useUiStore();

const userId = computed(() => userStore.user_id);
const error = computed(() => playlistStore.error);
const publicPlaylists = computed(() => playlistStore.allPublicPlaylists);
const sortBy = ref('created_at');
const subscriptionStatus = reactive<Record<string, boolean>>({});

const fetchAllPlaylists = async () => {
    uiStore.isLoading = true;
    try {
        await playlistStore.fetchAllPublicPlaylists();
        if (userId.value) {
            await playlistStore.fetchSubscribedPlaylists(userId.value);
            await checkSubscriptionStatus();
        }
    } catch (err) {
        // Ошибка уже обработана в store
    } finally {
        uiStore.isLoading = false;
    }
};

const sortedPlaylists = computed(() => {
    const arr = [...publicPlaylists.value];
    if (sortBy.value === 'created_at') {
        return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy.value === 'video_count') {
        return arr.sort((a, b) => (b.video_count || 0) - (a.video_count || 0));
    } else if (sortBy.value === 'title') {
        return arr.sort((a, b) => a.title.localeCompare(b.title));
    }
    return arr;
});

const checkSubscriptionStatus = async () => {
    if (!userId.value) return;

    for (const playlist of publicPlaylists.value) {
        if (playlist.user_id === userId.value) continue; // Пропускаем свои плейлисты

        try {
            const isSubscribed = await playlistStore.isSubscribedToPlaylist(userId.value, playlist.id);
            subscriptionStatus[playlist.id] = isSubscribed;
        } catch (err) {
            console.error(`Ошибка при проверке подписки на плейлист ${playlist.id}:`, err);
        }
    }
};

const handleSubscribe = async (playlistId: string) => {
    if (!userId.value) return;

    try {
        await playlistStore.subscribeToPlaylist(userId.value, playlistId);
        subscriptionStatus[playlistId] = true;
    } catch (err) {
        console.error(`Ошибка при подписке на плейлист ${playlistId}:`, err);
    }
};

const handleUnsubscribe = async (playlistId: string) => {
    if (!userId.value) return;

    try {
        await playlistStore.unsubscribeFromPlaylist(userId.value, playlistId);
        subscriptionStatus[playlistId] = false;
    } catch (err) {
        console.error(`Ошибка при отписке от плейлиста ${playlistId}:`, err);
    }
};

onMounted(fetchAllPlaylists);
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
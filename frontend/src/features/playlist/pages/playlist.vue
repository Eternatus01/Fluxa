<template>
    <div class="min-h-screen bg-[#0f0f0f]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Загрузка и ошибки -->
            <LoadingState v-if="uiStore.isLoading" />
            <ErrorState v-else-if="error" :message="error.message" />

            <template v-else-if="playlist">
                <!-- Шапка плейлиста -->
                <div class="flex flex-col md:flex-row gap-6 mb-8">
                    <!-- Обложка плейлиста -->
                    <div class="w-full md:w-1/3 lg:w-1/4">
                        <div class="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                            <img :src="thumbnailUrl" alt="Playlist Cover" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div
                                class="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-sm text-white font-medium">
                                {{ playlist.video_count }} {{ getVideoCountText(playlist.video_count) }}
                            </div>
                            <div v-if="!isPublic" class="absolute top-2 right-2">
                                <span
                                    class="bg-gray-800/90 backdrop-blur-sm text-gray-300 px-2 py-1 rounded-md text-xs">Приватный</span>
                            </div>
                        </div>
                    </div>

                    <!-- Информация о плейлисте -->
                    <div class="w-full md:w-2/3 lg:w-3/4">
                        <div class="flex items-center gap-3 mb-3">
                            <h1 class="text-3xl font-bold text-white line-clamp-2">{{ playlist.title }}</h1>
                        </div>
                        <div class="text-gray-400 mb-4">
                            <p class="line-clamp-4">{{ playlist.description || 'Без описания' }}</p>
                        </div>

                        <div class="flex items-center mb-4">
                            <img :src="playlist.avatar_url || '/default-avatar.jpg'" alt="Channel Avatar"
                                class="w-10 h-10 rounded-full mr-3 border-2 border-gray-700">
                            <div>
                                <div class="text-white font-medium">{{ playlist.channel_name }}</div>
                                <div class="text-gray-400 text-sm">Обновлено: <span>{{ timeAgo(playlist.created_at)
                                }}</span></div>
                            </div>
                        </div>

                        <div class="flex gap-2 mt-2">
                            <button v-if="playlist.videos && playlist.videos.length > 0 && isOwner" @click="playAll"
                                class="playlist-btn playlist-btn--play-red">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                </svg>
                                Воспроизвести все
                            </button>
                            <button v-if="isOwner" @click="goToEdit" class="playlist-btn playlist-btn--edit-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3h3" />
                                </svg>
                                Редактировать
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Список видео -->
                <div class="playlist-videos my-8">
                    <div class="playlist-header flex justify-between items-center mb-4">
                        <h2 class="text-white text-lg font-medium">Видео в плейлисте</h2>
                        <span class="text-gray-400 text-sm">{{ playlist.video_count }} {{
                            getVideoCountText(playlist.video_count) }}</span>
                    </div>

                    <div v-if="!playlist.videos || playlist.videos.length === 0" class="empty-state">
                        <p class="text-gray-400">В этом плейлисте пока нет видео</p>
                    </div>

                    <div v-else class="videos-list">
                        <div v-for="(video, index) in playlist.videos" :key="video.id"
                            class="video-item group hover:bg-gray-800/30 transition-colors duration-150 rounded"
                            @mouseenter="currentVideoId = video.id" @mouseleave="currentVideoId = null">
                            <div class="flex items-start p-4">
                                <!-- Номер видео -->
                                <div class="w-8 flex-shrink-0 text-gray-500 text-sm mr-3 pt-1">
                                    {{ index + 1 }}
                                </div>

                                <!-- Миниатюра (увеличенная) -->
                                <div class="w-40 sm:w-52 md:w-64 mr-5 flex-shrink-0">
                                    <div class="aspect-video bg-gray-800 rounded overflow-hidden">
                                        <router-link :to="{ name: 'Watch', params: { id: video.id } }">
                                            <img :src="video.thumbnail_url || '/default-thumbnail.jpg'"
                                                alt="Video Thumbnail" class="w-full h-full object-cover">
                                        </router-link>
                                    </div>
                                </div>

                                <!-- Информация о видео -->
                                <div class="flex-grow min-w-0 pt-1">
                                    <router-link :to="{ name: 'Watch', params: { id: video.id } }" class="block">
                                        <h3
                                            class="text-white text-base sm:text-lg hover:text-blue-400 transition-colors duration-200 mb-1 line-clamp-2">
                                            {{ video.title }}
                                        </h3>
                                    </router-link>
                                    <div class="text-gray-400 text-sm mb-1">{{ video.channel_name }}</div>
                                    <div class="text-gray-500 text-xs">
                                        {{ formatViewsCount(video.views) }} просмотров • {{ timeAgo(video.created_at) }}
                                    </div>
                                </div>

                                <!-- Кнопка удаления -->
                                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button v-if="isOwner" @click="removeVideo(video.id)"
                                        class="text-gray-400 hover:text-red-500 p-2" title="Удалить из плейлиста">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <!-- Разделительная линия (кроме последнего элемента) -->
                            <div v-if="index < playlist.videos.length - 1" class="border-t border-gray-800 mx-4"></div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/features/user/stores/userStore';
import { usePlaylistStore } from '../stores/playlistStore';
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import { timeAgo } from '@/widgets/timeAgo';
import type { Playlist } from '@/features/video/types';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const playlistStore = usePlaylistStore();
const uiStore = useUiStore();

const playlist = ref<Playlist | null>(null);
const error = computed(() => playlistStore.error);
const currentVideoId = ref<string | null>(null);

// Получаем ID плейлиста из параметров маршрута
const playlistId = computed(() => route.params.id as string);
const userId = computed(() => userStore.user_id);

// Проверяем, является ли текущий пользователь владельцем плейлиста
const isOwner = computed(() => {
    return userId.value && playlist.value && userId.value === playlist.value.user_id;
});

// Проверяем, является ли плейлист публичным
const isPublic = computed(() => {
    return playlist.value && playlist.value.is_public;
});

// Безопасное получение URL обложки плейлиста
const thumbnailUrl = computed(() => {
    return playlist.value?.thumbnail_url || '/default-playlist-cover.jpg';
});

// Форматирование просмотров
const formatViewsCount = (views: number): string => {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + ' млн';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + ' тыс';
    } else {
        return views.toString();
    }
};

// Вспомогательная функция для склонения слова "видео"
const getVideoCountText = (count: number) => {
    if (count === 0) {
        return 'видео';
    } else if (count === 1) {
        return 'видео';
    } else if (count >= 2 && count <= 4) {
        return 'видео';
    } else {
        return 'видео';
    }
};

// Загрузка данных плейлиста
const fetchPlaylist = async () => {
    if (!playlistId.value) return;

    uiStore.isLoading = true;

    try {
        // Получаем информацию о плейлисте из API через store
        const playlistData = await playlistStore.fetchPlaylist(playlistId.value, userId.value);
        playlist.value = playlistData;
    } catch (err) {
        // error уже обработан в store
    } finally {
        uiStore.isLoading = false;
    }
    console.log(playlist.value);
};

// Удаление видео из плейлиста
const removeVideo = async (videoId: string) => {
    if (!playlistId.value || !userId.value || !videoId) return;

    if (!confirm('Вы уверены, что хотите удалить это видео из плейлиста?')) return;

    uiStore.isLoading = true;
    try {
        await playlistStore.removeVideoFromPlaylist({
            playlist_id: playlistId.value,
            video_id: videoId,
            user_id: userId.value
        });
        // Перезагрузить плейлист после удаления
        await fetchPlaylist();
    } catch (err) {
        // error уже обработан в store
    } finally {
        uiStore.isLoading = false;
    }
};

// Воспроизведение всех видео плейлиста
const playAll = () => {
    if (playlist.value?.videos && playlist.value.videos.length > 0) {
        // Переходим к первому видео в плейлисте
        router.push({
            name: 'Watch',
            params: { id: playlist.value.videos[0].id },
            query: { playlist: playlistId.value }
        });
    }
};

const goToEdit = () => {
    router.push({ name: 'EditPlaylist', params: { id: playlistId.value } });
};

onMounted(fetchPlaylist);
</script>

<style scoped>
/* Анимации и стили для страницы плейлиста */
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.line-clamp-4 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
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

.videos-list {
    animation: fadeIn 0.5s ease-out;
}

.video-item {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.playlist-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: 8px;
    border: 1.5px solid;
    font-size: 0.98rem;
    font-weight: 400;
    padding: 0.38rem 0.95rem;
    background: transparent;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    box-shadow: none;
    cursor: pointer;
}

.playlist-btn--play-red {
    border-color: #ef4444;
    color: #ef4444;
    background: transparent;
}

.playlist-btn--play-red:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: #dc2626;
    color: #dc2626;
}

.playlist-btn--edit-blue {
    border-color: #2563eb;
    color: #2563eb;
    background: transparent;
}

.playlist-btn--edit-blue:hover {
    background: rgba(37, 99, 235, 0.08);
    border-color: #1d4ed8;
    color: #1d4ed8;
}
</style>
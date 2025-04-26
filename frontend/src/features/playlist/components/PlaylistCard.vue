<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    playlist: any;
    showSubscribe?: boolean;
    isSubscribed?: boolean;
}>();

const emit = defineEmits<{
    (e: 'subscribe'): void;
    (e: 'unsubscribe'): void;
}>();

// Безопасное получение URL обложки плейлиста
const thumbnailUrl = computed(() => props.playlist.thumbnail_url || '/default-playlist-cover.jpg');

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
}
</script>

<template>
    <div
        class="playlist-card bg-[#18181c] group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.025] transition-all duration-300 border border-gray-800 hover:border-blue-500 cursor-pointer relative">
        <!-- Кнопка подписки в правом верхнем углу -->
        <div v-if="props.showSubscribe" class="absolute top-3 right-3 z-10">
            <button v-if="!props.isSubscribed" @click.stop="emit('subscribe')"
                class="w-7 h-7 rounded-full bg-blue-500/70 hover:bg-blue-500 flex items-center justify-center shadow-md transition-all duration-200"
                title="Подписаться">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <button v-else @click.stop="emit('unsubscribe')"
                class="w-7 h-7 rounded-full bg-gray-600/70 hover:bg-gray-600 flex items-center justify-center shadow-md transition-all duration-200"
                title="Отписаться">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
                </svg>
            </button>
        </div>

        <router-link :to="{ name: 'Playlist', params: { id: playlist.id } }">
            <div class="relative aspect-video">
                <img :src="thumbnailUrl" alt="Playlist Cover"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">

                <div
                    class="absolute bottom-3 right-3 flex items-center bg-black/60 px-3 py-1 rounded text-white text-base font-bold">
                    {{ playlist.video_count }}
                    <span class="text-xs font-medium ml-2">{{ getVideoCountText(playlist.video_count) }}</span>
                </div>
            </div>
        </router-link>

        <div class="relative">
            <!-- Аватарка, наполовину накладывающаяся на обложку -->
            <div class="absolute -top-8 left-5 rounded-full border-2 border-[#18181c] z-10">
                <router-link :to="{
                    name: 'Channel',
                    params: {
                        username: playlist.username || 'user-' + playlist.user_id
                    }
                }" @click.stop>
                    <img :src="playlist.avatar_url || '/default-avatar.jpg'" alt="Channel Avatar"
                        class="w-16 h-16 rounded-full object-cover transition-transform duration-300 hover:scale-105">
                </router-link>
            </div>
        </div>

        <div class="p-5 pt-10">
            <div class="flex items-start justify-between">
                <div>
                    <router-link :to="{
                        name: 'Channel',
                        params: {
                            username: playlist.username || 'user-' + playlist.user_id
                        }
                    }" class="text-gray-200 text-sm font-medium hover:text-blue-400 transition-colors duration-200"
                        @click.stop>
                        {{ playlist.channel_name || 'Канал' }}
                    </router-link>

                    <router-link :to="{ name: 'Playlist', params: { id: playlist.id } }" class="block mt-2">
                        <h3
                            class="text-white text-lg font-bold hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                            {{ playlist.title }}
                        </h3>
                    </router-link>
                </div>

                <div
                    :class="['text-xs px-2 py-1 rounded-full font-semibold h-fit', playlist.is_public ? 'bg-green-600/20 text-green-400 border border-green-600/40' : 'bg-red-600/20 text-red-400 border border-red-600/40']">
                    {{ playlist.is_public ? 'Публичный' : 'Приватный' }}
                </div>
            </div>

            <p class="text-gray-400 text-sm mt-3 line-clamp-2">{{ playlist.description || 'Без описания' }}</p>

            <div class="flex items-center mt-4 text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                        d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
                <span>{{ new Date(playlist.created_at).toLocaleDateString() }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.playlist-card {
    animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

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

.playlist-badge {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-fadeIn {
    animation: fadeInBadge 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes fadeInBadge {
    0% {
        opacity: 0;
        transform: translateY(10px) scale(0.9);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

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
</style>
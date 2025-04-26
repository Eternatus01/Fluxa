<template>
    <div class="mb-6 bg-[#1e1e1e]/60 p-4 rounded-lg relative" ref="menuContainer">
        <div v-if="video.type !== 'public'"
            class="inline-block px-2 py-1 mb-2 text-xs font-medium bg-blue-600/80 text-white rounded">
            {{ video.type }}
        </div>
        <div class="flex items-center justify-between mb-3">
            <h1 class="text-xl md:text-2xl font-semibold text-white">{{ video.title }}</h1>
            <!-- Кнопка с тремя точками -->
            <button @click="toggleMenu" class="ml-2 p-2 rounded-full hover:bg-gray-700/60 transition relative z-20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                </svg>
            </button>
            <!-- Выпадающее меню -->
            <div v-if="isMenuOpen"
                class="absolute right-0 mt-10 w-56 bg-[#232323] rounded-lg shadow-lg z-30 animate-fadeIn">
                <ul class="py-2">
                    <li>
                        <button @click="openPlaylistMenu"
                            class="w-full text-left px-4 py-2 text-white hover:bg-gray-700 hover:text-blue-500">Добавить
                            в плейлист</button>
                    </li>
                </ul>
            </div>
            <!-- Меню выбора плейлиста -->
            <div v-if="isPlaylistMenuOpen"
                class="absolute right-0 mt-10 w-72 bg-[#232323] rounded-lg shadow-lg z-40 animate-fadeIn">
                <div class="p-4 border-b border-gray-700 text-white font-medium">Выберите плейлист</div>
                <ul class="max-h-60 overflow-y-auto">
                    <li v-for="playlist in playlists" :key="playlist.id">
                        <button @click="addToPlaylist(playlist.id)"
                            class="w-full text-left px-4 py-2 text-white hover:bg-blue-600/80 hover:text-white flex items-center gap-2">
                            <img :src="playlist.thumbnail_url || '/default-playlist-cover.jpg'"
                                class="w-8 h-8 rounded object-cover" alt="" />
                            <span class="truncate">{{ playlist.title }}</span>
                        </button>
                    </li>
                </ul>
                <div class="border-t border-gray-700">
                    <button @click="goToCreatePlaylist"
                        class="w-full px-4 py-3 text-blue-400 hover:text-blue-500 hover:bg-gray-800 transition text-left">+
                        Создать новый плейлист</button>
                </div>
            </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4">
            <Reactions :targetId="video.id" :initialLikes="video.likes_count" :initialDislikes="video.dislikes_count"
                entityType="video" class="flex items-center space-x-4" />
            <p class="text-gray-300 text-sm flex items-center gap-2">
                <span class="font-medium">{{ video.views }} просмотров</span>
                <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                <TimeAgo :date="video.created_at" class="text-gray-400" />
            </p>
        </div>
        <!-- Уведомление -->
        <transition name="fade">
            <div v-if="showSuccess"
                class="absolute top-2 right-2 bg-green-600/90 text-white px-4 py-2 rounded shadow-lg z-50">
                Видео добавлено в плейлист!
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/features/user/stores/userStore';
import { usePlaylistStore } from '@/features/playlist/stores/playlistStore';
import TimeAgo from './../../../shared/ui/atoms/TimeAgo.vue';
import Reactions from '../../../shared/ui/molecules/Reactions.vue';

const props = defineProps({
    video: {
        type: Object,
        required: true,
    },
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const playlistStore = usePlaylistStore();

const isMenuOpen = ref(false);
const isPlaylistMenuOpen = ref(false);
const showSuccess = ref(false);
const playlists = ref([]);
const menuContainer = ref(null);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    isPlaylistMenuOpen.value = false;
};

const openPlaylistMenu = async () => {
    console.log('Открываем меню выбора плейлиста');
    isMenuOpen.value = false;
    await playlistStore.fetchUserPlaylists(userStore.user_id);
    playlists.value = playlistStore.playlists;
    console.log('playlists:', playlists.value);
    setTimeout(() => {
        isPlaylistMenuOpen.value = true;
    }, 0);
};

const addToPlaylist = async (playlistId) => {
    try {
        await playlistStore.addVideoToPlaylist({
            playlist_id: playlistId,
            video_id: props.video.id,
            user_id: userStore.user_id,
        });
        isPlaylistMenuOpen.value = false;
        showSuccess.value = true;
        setTimeout(() => showSuccess.value = false, 2000);
    } catch (e) {
        alert('Ошибка при добавлении в плейлист');
    }
};

const goToCreatePlaylist = () => {
    isPlaylistMenuOpen.value = false;
    router.push({ name: 'CreatePlaylist' });
};

const handleClickOutside = (event) => {
    if (menuContainer.value && !menuContainer.value.contains(event.target)) {
        isMenuOpen.value = false;
        isPlaylistMenuOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
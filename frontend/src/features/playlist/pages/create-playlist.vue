<template>
    <div class="min-h-screen bg-[#0f0f0f]">
        <div class="max-w-3xl mx-auto px-4 py-8">
            <h1 class="text-2xl font-medium text-white mb-6">Создание плейлиста</h1>

            <div class="playlist-form">
                <!-- Форма создания плейлиста -->
                <form @submit.prevent="createPlaylist" class="space-y-5">
                    <!-- Основные поля -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <!-- Превью плейлиста с возможностью загрузки обложки -->
                        <div class="w-full md:w-1/3">
                            <div
                                class="aspect-video bg-gray-800 rounded-md flex items-center justify-center mb-3 relative group border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
                                <label
                                    class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10">
                                    <div v-if="coverPreview" class="absolute inset-0">
                                        <img :src="coverPreview" alt="Превью обложки"
                                            class="object-cover w-full h-full rounded-md" />
                                        <div
                                            class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white mb-2"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                            <span class="text-white font-medium">Заменить обложку</span>
                                        </div>
                                    </div>
                                    <div v-else class="flex flex-col items-center justify-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                        </svg>
                                        <span class="font-medium">Загрузить обложку</span>
                                        <span class="text-xs text-gray-500 mt-1">JPG, PNG, до 2MB</span>
                                        <span class="text-xs text-gray-500 mt-1">Или оставьте пустым — будет выбрана
                                            автоматически</span>
                                    </div>
                                    <input type="file" accept="image/*"
                                        class="absolute inset-0 opacity-0 cursor-pointer" @change="handleCoverChange" />
                                </label>
                                <div v-if="coverFile && coverFile.name"
                                    class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {{ coverFile.name }}
                                </div>
                            </div>
                        </div>

                        <!-- Поля ввода данных плейлиста -->
                        <div class="w-full md:w-2/3 space-y-4">
                            <div>
                                <label for="title" class="block text-white mb-1">Название плейлиста*</label>
                                <input id="title" v-model="playlistData.title" type="text"
                                    class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Введите название плейлиста" required maxlength="30">
                                <div class="text-xs text-gray-500 mt-1 text-right">{{ playlistData.title.length }}/30
                                </div>
                            </div>

                            <div>
                                <label for="description" class="block text-white mb-1">Описание</label>
                                <textarea id="description" v-model="playlistData.description"
                                    class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder="Добавьте описание (необязательно)" rows="4" maxlength="100"></textarea>
                                <div class="text-xs text-gray-500 mt-1 text-right">{{ playlistData.description.length
                                }}/100</div>
                            </div>

                            <div class="flex items-center mt-4">
                                <input id="is_public" v-model="playlistData.is_public" type="checkbox"
                                    class="h-4 w-4 text-blue-500 rounded border-gray-700 focus:ring-0 focus:ring-offset-0 bg-gray-800">
                                <label for="is_public" class="ml-2 text-white">Публичный плейлист</label>
                            </div>
                        </div>
                    </div>

                    <!-- Сообщение об ошибке -->
                    <div v-if="error" class="text-red-500 bg-red-500/10 p-3 rounded-md">
                        {{ error }}
                    </div>

                    <!-- Кнопки действий -->
                    <div class="flex justify-end space-x-3 mt-6">
                        <router-link to="/profile"
                            class="px-4 py-2 border border-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                            Отмена
                        </router-link>
                        <button type="submit"
                            class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            :disabled="uiStore.isLoading">
                            <span v-if="uiStore.isLoading">Создание...</span>
                            <span v-else>Создать плейлист</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/features/user/stores/userStore';
import { usePlaylistStore } from '../stores/playlistStore';
import type { CreatePlaylistRequest } from '@/features/video/types';
import { usePlaylist } from '../composable/usePlaylist';
import { useUiStore } from '@/shared/stores/uiStore';

const router = useRouter();
const userStore = useUserStore();
const playlistStore = usePlaylistStore();
const uiStore = useUiStore();
const { uploadPlaylistCover } = usePlaylist();

// Состояния формы
const error = ref<string | null>(null);
const coverFile = ref<File | null>(null);
const coverPreview = ref<string | null>(null);

// Данные плейлиста
const playlistData = reactive<CreatePlaylistRequest>({
    user_id: '',
    title: '',
    description: '',
    is_public: true,
    thumbnail_url: null
});

// Установка ID пользователя при загрузке компонента
onMounted(() => {
    // Проверка авторизации пользователя
    if (!userStore.user_id) {
        router.push({ name: 'Login' });
        return;
    }

    playlistData.user_id = userStore.user_id;
});

const handleCoverChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) {
        coverFile.value = files[0];
        coverPreview.value = URL.createObjectURL(files[0]);
    } else {
        coverFile.value = null;
        coverPreview.value = null;
    }
};

// Создание плейлиста
const createPlaylist = async () => {
    uiStore.isLoading = true;
    try {
        error.value = null;

        if (!playlistData.title.trim()) {
            error.value = "Название плейлиста обязательно";
            return;
        }

        // Если выбрана обложка, сначала загружаем её
        if (coverFile.value) {
            const ext = coverFile.value.name.split('.').pop();
            const coverPath = `${playlistData.user_id}/playlist-cover-${Date.now()}.${ext}`;
            playlistData.thumbnail_url = await uploadPlaylistCover(coverFile.value, coverPath);
        } else {
            // thumbnail_url будет null, чтобы бэкенд использовал превью из последнего видео
            playlistData.thumbnail_url = null;
        }

        // Создание плейлиста через store
        const newPlaylist = await playlistStore.createPlaylist(playlistData);

        // Переходим на страницу созданного плейлиста
        router.push({
            name: 'Playlist',
            params: { id: newPlaylist.id }
        });

    } catch (err) {
        console.error('Ошибка при создании плейлиста:', err);
        error.value = err instanceof Error ? err.message : 'Произошла ошибка при создании плейлиста';
    } finally {
        uiStore.isLoading = false;
    }
};
</script>

<style scoped>
/* Анимации и переходы */
.playlist-form {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
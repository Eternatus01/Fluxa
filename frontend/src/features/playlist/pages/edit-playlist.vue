<template>
    <div class="min-h-screen bg-[#0f0f0f]">
        <div class="max-w-3xl mx-auto px-4 py-8">
            <h1 class="text-2xl font-medium text-white mb-6">Редактирование плейлиста</h1>

            <LoadingState v-if="uiStore.isLoading" />
            <div class="playlist-form" v-else>
                <form @submit.prevent="onUpdate" class="space-y-5">
                    <div class="flex flex-col md:flex-row gap-6">
                        <!-- Превью и загрузка обложки -->
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
                                        <span class="text-xs text-gray-500 mt-1">Оставьте пустым — не менять</span>
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
                        <!-- Поля ввода -->
                        <div class="w-full md:w-2/3 space-y-4">
                            <div>
                                <label for="title" class="block text-white mb-1">Название плейлиста*</label>
                                <input id="title" v-model="form.title" type="text"
                                    class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Введите название плейлиста" required maxlength="30">
                                <div class="text-xs text-gray-500 mt-1 text-right">{{ form.title.length }}/30</div>
                            </div>
                            <div>
                                <label for="description" class="block text-white mb-1">Описание</label>
                                <textarea id="description" v-model="form.description"
                                    class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder="Добавьте описание (необязательно)" rows="4" maxlength="100"></textarea>
                                <div class="text-xs text-gray-500 mt-1 text-right">{{ form.description.length }}/100
                                </div>
                            </div>
                            <div class="flex items-center mt-4">
                                <input id="is_public" v-model="form.is_public" type="checkbox"
                                    class="h-4 w-4 text-blue-500 rounded border-gray-700 focus:ring-0 focus:ring-offset-0 bg-gray-800">
                                <label for="is_public" class="ml-2 text-white">Публичный плейлист</label>
                            </div>
                        </div>
                    </div>
                    <div v-if="error" class="text-red-500 bg-red-500/10 p-3 rounded-md">
                        {{ error }}
                    </div>
                    <div class="flex justify-end space-x-3 mt-6">
                        <router-link :to="{ name: 'Playlist', params: { id: playlistId } }"
                            class="px-4 py-2 border border-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                            Отмена
                        </router-link>
                        <button type="submit"
                            class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            :disabled="uiStore.isLoading">
                            <span v-if="uiStore.isLoading">Сохранение...</span>
                            <span v-else>Сохранить изменения</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/features/user/stores/userStore';
import { usePlaylistStore } from '../stores/playlistStore';
import { usePlaylist } from '../composable/usePlaylist';
import type { Playlist, UpdatePlaylistRequest } from '@/features/playlist/types/playlistTypes';
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const playlistStore = usePlaylistStore();
const uiStore = useUiStore();
const { uploadPlaylistCover } = usePlaylist();

const playlistId = ref(route.params.id as string);
const userId = computed(() => userStore.user_id);

const error = ref<string | null>(null);
const coverFile = ref<File | null>(null);
const coverPreview = ref<string | null>(null);

const form = reactive({
    title: '',
    description: '',
    is_public: true,
    thumbnail_url: '' as string | null
});

onMounted(async () => {
    uiStore.isLoading = true;
    try {
        if (!playlistId.value || !userId.value) {
            router.push({ name: 'Playlists' });
            return;
        }
        const playlist = await playlistStore.fetchPlaylist(playlistId.value, userId.value);
        form.title = playlist.title;
        form.description = playlist.description;
        form.is_public = playlist.is_public;
        form.thumbnail_url = playlist.thumbnail_url;
        coverPreview.value = playlist.thumbnail_url;
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Не удалось загрузить плейлист';
    } finally {
        uiStore.isLoading = false;
    }
});

const handleCoverChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) {
        coverFile.value = files[0];
        coverPreview.value = URL.createObjectURL(files[0]);
    } else {
        coverFile.value = null;
        coverPreview.value = form.thumbnail_url;
    }
};

const onUpdate = async () => {
    uiStore.isLoading = true;
    try {
        error.value = null;
        let thumbnail_url = form.thumbnail_url;
        if (coverFile.value) {
            const ext = coverFile.value.name.split('.').pop();
            const coverPath = `${userId.value}/playlist-cover-${Date.now()}.${ext}`;
            thumbnail_url = await uploadPlaylistCover(coverFile.value, coverPath);
        }
        const updateData: UpdatePlaylistRequest = {
            playlist_id: playlistId.value,
            user_id: userId.value,
            title: form.title,
            description: form.description,
            is_public: form.is_public,
            thumbnail_url
        };
        await playlistStore.updatePlaylist(updateData);
        router.push({ name: 'Playlist', params: { id: playlistId.value } });
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Не удалось сохранить изменения';
    } finally {
        uiStore.isLoading = false;
    }
};
</script>

<style scoped>
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
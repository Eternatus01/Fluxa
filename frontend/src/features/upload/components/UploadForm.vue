<script setup lang="ts">
import { ref } from 'vue';
import FileUploadField from './FileUploadField.vue';
import UploadProgress from './UploadProgress.vue';
import type { VideoUploadParams } from '../../video/types/videoTypes';

const emit = defineEmits<{
    (e: 'submit', data: VideoUploadParams): void;
}>();

const props = defineProps<{
    isUploading: boolean;
    uploadProgress: number;
    uploadError: Error | null;
}>();

const title = ref('');
const description = ref('');
const tags = ref('');
const videoFile = ref<File | null>(null);
const thumbnailFile = ref<File | null>(null);
const videoType = ref('public');

const handleVideoSelected = (file: File) => {
    videoFile.value = file;
};

const handleThumbnailSelected = (file: File) => {
    thumbnailFile.value = file;
};

const handleSubmit = () => {
    if (!title.value.trim()) {
        alert('Пожалуйста, введите название видео');
        return;
    }

    if (!videoFile.value || !thumbnailFile.value) {
        alert('Пожалуйста, выберите видео и миниатюру');
        return;
    }

    const tagsArray = tags.value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

    emit('submit', {
        title: title.value,
        description: description.value,
        videoFile: videoFile.value,
        thumbnailFile: thumbnailFile.value,
        tags: tagsArray,
        videoType: videoType.value,
    });
};
</script>

<template>
    <section class="bg-[#1e1e1e]/60 rounded-lg p-6 md:p-8 shadow-lg overflow-hidden mb-8">
        <!-- Прогресс загрузки -->
        <UploadProgress :is-uploading="isUploading" :progress="uploadProgress" />

        <!-- Сообщение об ошибке -->
        <div v-if="uploadError"
            class="bg-red-900/70 backdrop-blur-sm text-white p-4 rounded-lg mb-6 border border-red-700/50">
            <div class="flex items-start gap-3">
                <div class="text-red-400 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h4 class="font-medium text-red-200 mb-1">Ошибка загрузки</h4>
                    <p class="text-sm text-red-100/80">{{ uploadError.message || 'Произошла ошибка при загрузке видео'
                        }}</p>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <!-- Поле для названия видео -->
            <div>
                <label class="block text-sm font-medium mb-2 text-gray-200">Название видео</label>
                <input type="text"
                    class="w-full p-3 bg-[#252525] rounded-lg text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Введите название видео" v-model="title">
            </div>

            <!-- Поле для описания -->
            <div>
                <label class="block text-sm font-medium mb-2 text-gray-200">Описание</label>
                <textarea
                    class="w-full p-3 bg-[#252525] rounded-lg text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="4" placeholder="Опишите ваше видео" v-model="description"></textarea>
            </div>

            <!-- Поле для тегов -->
            <div>
                <label class="block text-sm font-medium mb-2 text-gray-200">Теги (через запятую)</label>
                <input type="text"
                    class="w-full p-3 bg-[#252525] rounded-lg text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="gaming, tutorial, vlog" v-model="tags">
                <p class="text-xs text-gray-400 mt-1">Разделяйте теги запятыми, например: music, новости, обзор</p>
            </div>

            <!-- Поле для загрузки файла (видео) -->
            <FileUploadField label="Выберите видео для загрузки" accept="video/*" :max-size="100 * 1024 * 1024"
                @file-selected="handleVideoSelected" />

            <!-- Поле для миниатюры -->
            <FileUploadField label="Загрузите миниатюру" accept="image/*" :max-size="5 * 1024 * 1024"
                @file-selected="handleThumbnailSelected" />

            <div>
                <label class="block text-sm font-medium mb-2 text-gray-200">Тип видео</label>
                <select v-model="videoType"
                    class="w-full p-3 bg-[#252525] rounded-lg text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="public">Публичное</option>
                    <option value="private">Приватное</option>
                    <option value="link">Доступ по ссылке</option>
                </select>
                <p class="text-xs text-gray-400 mt-1">
                    <span v-if="videoType === 'public'">Видео будет доступно всем пользователям</span>
                    <span v-else-if="videoType === 'private'">Видео будет доступно только вам</span>
                    <span v-else>Видео будет доступно только по прямой ссылке</span>
                </p>
            </div>

            <!-- Кнопка загрузки -->
            <button
                class="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                @click="handleSubmit" :disabled="isUploading">
                <span v-if="isUploading">Загрузка...</span>
                <span v-else>Загрузить видео</span>
            </button>
        </div>
    </section>
</template>
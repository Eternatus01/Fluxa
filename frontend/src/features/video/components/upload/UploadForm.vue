<script setup lang="ts">
import { ref } from 'vue';
import FileUploadField from './FileUploadField.vue';
import UploadProgress from './UploadProgress.vue';
import type { VideoUploadParams } from '../../types/videoTypes';

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
    <section class="bg-gray-900 rounded-lg p-8 mb-8 shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Загрузить видео</h2>

        <UploadProgress :is-uploading="isUploading" :progress="uploadProgress" />

        <!-- Сообщение об ошибке -->
        <div v-if="uploadError" class="bg-red-900 text-white p-4 rounded-lg mb-6">
            {{ uploadError.message || 'Произошла ошибка при загрузке видео' }}
        </div>

        <div class="space-y-6">
            <!-- Поле для названия видео -->
            <div>
                <label class="block text-sm font-medium mb-2">Название видео</label>
                <input type="text"
                    class="w-full p-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Введите название видео" v-model="title">
            </div>

            <!-- Поле для описания -->
            <div>
                <label class="block text-sm font-medium mb-2">Описание</label>
                <textarea
                    class="w-full p-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows="4" placeholder="Опишите ваше видео" v-model="description"></textarea>
            </div>

            <!-- Поле для тегов -->
            <div>
                <label class="block text-sm font-medium mb-2">Теги (через запятую)</label>
                <input type="text"
                    class="w-full p-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Введите теги видео" v-model="tags">
            </div>

            <!-- Поле для загрузки файла (видео) -->
            <FileUploadField label="Выберите видео" accept="video/*" :max-size="100 * 1024 * 1024"
                @file-selected="handleVideoSelected" />

            <!-- Поле для миниатюры -->
            <FileUploadField label="Загрузите миниатюру" accept="image/*" :max-size="5 * 1024 * 1024"
                @file-selected="handleThumbnailSelected" />

            <div>
                <label class="block text-sm font-medium mb-2">Тип видео</label>
                <select v-model="videoType" class="w-full p-2 bg-gray-800 rounded-lg text-white border border-gray-700">
                    <option value="public">Публичное</option>
                    <option value="private">Приватное</option>
                    <option value="link">Доступ по ссылке</option>
                </select>
            </div>

            <!-- Кнопка загрузки -->
            <button
                class="w-full py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors text-white font-semibold"
                @click="handleSubmit" :disabled="isUploading">
                {{ isUploading ? 'Загрузка...' : 'Загрузить видео' }}
            </button>
        </div>
    </section>
</template>
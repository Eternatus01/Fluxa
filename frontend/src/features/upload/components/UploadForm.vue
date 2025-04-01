<script setup lang="ts">
import { ref } from 'vue';
import FileUploadField from './FileUploadField.vue';
import UploadProgress from './UploadProgress.vue';
import UploadFormField from './UploadFormField.vue';
import UploadFormSelect from './UploadFormSelect.vue';
import UploadFormError from './UploadFormError.vue';
import UploadFormButton from './UploadFormButton.vue';
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
        <UploadFormError :error="uploadError" />

        <div class="space-y-6">
            <!-- Поле для названия видео -->
            <UploadFormField v-model="title" label="Название видео" placeholder="Введите название видео" />

            <!-- Поле для описания -->
            <UploadFormField v-model="description" label="Описание" type="textarea" :rows="4"
                placeholder="Опишите ваше видео" />

            <!-- Поле для тегов -->
            <UploadFormField v-model="tags" label="Теги (через запятую)" placeholder="gaming, tutorial, vlog"
                hint="Разделяйте теги запятыми, например: music, новости, обзор" />

            <!-- Поле для загрузки файла (видео) -->
            <FileUploadField label="Выберите видео для загрузки" accept="video/*" :max-size="100 * 1024 * 1024"
                @file-selected="handleVideoSelected" />

            <!-- Поле для миниатюры -->
            <FileUploadField label="Загрузите миниатюру" accept="image/*" :max-size="5 * 1024 * 1024"
                @file-selected="handleThumbnailSelected" />

            <!-- Выбор типа видео -->
            <UploadFormSelect v-model="videoType" />

            <!-- Кнопка загрузки -->
            <UploadFormButton :is-loading="isUploading" @click="handleSubmit" />
        </div>
    </section>
</template>
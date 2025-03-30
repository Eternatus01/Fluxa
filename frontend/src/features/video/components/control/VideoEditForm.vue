<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Video } from '../../types/videoTypes';
import TagsInput from './TagsInput.vue';
import ThumbnailUpload from './ThumbnailUpload.vue';

interface FormErrors {
    title?: string;
    description?: string;
    tags?: string;
}

const props = defineProps<{
    video: Video;
    isSaving: boolean;
}>();

const emit = defineEmits<{
    (e: 'save', data: Partial<Video>): void;
    (e: 'reset'): void;
}>();

// Глубокое копирование объекта видео
const videoData = ref<Video>({ ...props.video, tags: [...(props.video.tags || [])] });
const thumbnailFile = ref<File | null>(null);
const errors = ref<FormErrors>({});
const tagsInput = ref(props.video.tags?.join(', ') || '');

// Функция для преобразования строки тегов в массив
const processTags = (tagString: string): string[] => {
    return tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
};

// Обновление тегов в видео при изменении tagsInput
const updateTags = (value: string) => {
    console.log('updateTags вызван с:', value);
    tagsInput.value = value;
    videoData.value.tags = processTags(value);
};

// Следим за изменениями props.video
watch(() => props.video, (newVideo) => {
    console.log('props.video изменился, обновляем videoData');
    videoData.value = { ...newVideo, tags: [...(newVideo.tags || [])] };
    tagsInput.value = newVideo.tags?.join(', ') || '';
}, { deep: true });

const descriptionLength = computed(() => videoData.value.description?.length || 0);

const validateForm = () => {
    errors.value = {};

    if (!videoData.value.title.trim()) {
        errors.value.title = 'Название обязательно';
    }

    if (videoData.value.description && videoData.value.description.length > 5000) {
        errors.value.description = 'Описание слишком длинное';
    }

    const tags = processTags(tagsInput.value);
    if (tags.length > 15) {
        errors.value.tags = 'Максимум 15 тегов';
    }

    return Object.keys(errors.value).length === 0;
};

const handleThumbnailSelected = (file: File) => {
    thumbnailFile.value = file;
};

const handleTagsInput = (value: string) => {
    updateTags(value);
};

const saveChanges = () => {
    if (!validateForm()) return;

    // Обновляем теги перед сохранением
    videoData.value.tags = processTags(tagsInput.value);

    emit('save', {
        ...videoData.value,
        thumbnailFile: thumbnailFile.value || undefined,
    });
};

const resetForm = () => {
    videoData.value = { ...props.video, tags: [...(props.video.tags || [])] };
    tagsInput.value = props.video.tags?.join(', ') || '';
    thumbnailFile.value = null;
    errors.value = {};
    emit('reset');
};
</script>

<template>
    <section class="bg-gray-800 rounded-xl p-6 shadow-2xl">
        <h1 class="text-3xl font-bold mb-8">Управление видео</h1>

        <form @submit.prevent="saveChanges" class="space-y-6">
            <!-- Секция основной информации -->
            <div class="space-y-4">
                <h2 class="text-xl font-semibold text-gray-300">Основная информация</h2>

                <!-- Название видео -->
                <div>
                    <label class="block text-sm font-medium mb-2">Название</label>
                    <input v-model="videoData.title" type="text"
                        class="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.title }">
                    <p v-if="errors.title" class="text-red-400 text-sm mt-1">{{ errors.title }}</p>
                </div>

                <!-- Описание -->
                <div>
                    <label class="block text-sm font-medium mb-2">Описание</label>
                    <textarea v-model="videoData.description" rows="4"
                        class="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.description }"></textarea>
                    <div class="flex justify-between mt-1">
                        <p v-if="errors.description" class="text-red-400 text-sm">{{ errors.description }}</p>
                        <span class="text-gray-400 text-sm">{{ descriptionLength }}/5000</span>
                    </div>
                </div>
            </div>

            <!-- Секция миниатюры -->
            <ThumbnailUpload :current-thumbnail="videoData.thumbnail_url" @file-selected="handleThumbnailSelected" />

            <!-- Секция настроек -->
            <div class="space-y-4">
                <h2 class="text-xl font-semibold text-gray-300">Настройки</h2>

                <div>
                    <label class="block text-sm font-medium mb-2">Видимость</label>
                    <select v-model="videoData.videoType"
                        class="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500">
                        <option value="public">Публичное</option>
                        <option value="link">Ссылочное</option>
                        <option value="private">Приватное</option>
                    </select>
                </div>

                <TagsInput v-model="tagsInput" :error="errors.tags" @update:modelValue="updateTags" />
            </div>

            <!-- Кнопки управления -->
            <div class="flex justify-end gap-4 pt-6">
                <button type="button" @click="resetForm"
                    class="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors">
                    Сбросить
                </button>
                <button type="submit" :disabled="isSaving"
                    class="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50">
                    {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
            </div>
        </form>
    </section>
</template>
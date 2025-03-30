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
    <section class="bg-[#1e1e1e]/60 rounded-lg p-6 md:p-8 shadow-lg mb-6">
        <h1 class="text-2xl md:text-3xl font-bold mb-6 text-white">Управление видео</h1>

        <form @submit.prevent="saveChanges" class="space-y-6">
            <!-- Секция основной информации -->
            <div class="space-y-5">
                <h2 class="text-lg font-semibold text-gray-200 pb-2 border-b border-gray-700/50">Основная информация
                </h2>

                <!-- Название видео -->
                <div>
                    <label class="block text-sm font-medium mb-2 text-gray-200">Название</label>
                    <input v-model="videoData.title" type="text"
                        class="w-full p-3 bg-[#252525] rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                        :class="{ 'border-red-500 focus:ring-red-500': errors.title }">
                    <p v-if="errors.title" class="text-red-400 text-sm mt-1">{{ errors.title }}</p>
                </div>

                <!-- Описание -->
                <div>
                    <label class="block text-sm font-medium mb-2 text-gray-200">Описание</label>
                    <textarea v-model="videoData.description" rows="4"
                        class="w-full p-3 bg-[#252525] rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                        :class="{ 'border-red-500 focus:ring-red-500': errors.description }"></textarea>
                    <div class="flex justify-between mt-1">
                        <p v-if="errors.description" class="text-red-400 text-sm">{{ errors.description }}</p>
                        <span class="text-gray-400 text-sm">{{ descriptionLength }}/5000</span>
                    </div>
                </div>
            </div>

            <!-- Секции в две колонки на больших экранах -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Секция миниатюры -->
                <ThumbnailUpload :current-thumbnail="videoData.thumbnail_url"
                    @file-selected="handleThumbnailSelected" />

                <!-- Секция настроек -->
                <div class="space-y-5">
                    <h2 class="text-lg font-semibold text-gray-200 pb-2 border-b border-gray-700/50">Настройки</h2>

                    <div>
                        <label class="block text-sm font-medium mb-2 text-gray-200">Видимость</label>
                        <select v-model="videoData.videoType"
                            class="w-full p-3 bg-[#252525] rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white">
                            <option value="public">Публичное</option>
                            <option value="link">Ссылочное</option>
                            <option value="private">Приватное</option>
                        </select>
                        <p class="text-xs text-gray-400 mt-1">
                            <span v-if="videoData.videoType === 'public'">Видео будет доступно всем пользователям</span>
                            <span v-else-if="videoData.videoType === 'private'">Видео будет доступно только вам</span>
                            <span v-else>Видео будет доступно только по прямой ссылке</span>
                        </p>
                    </div>

                    <TagsInput v-model="tagsInput" :error="errors.tags" @update:modelValue="updateTags" />
                </div>
            </div>

            <!-- Кнопки управления -->
            <div class="flex flex-wrap justify-end gap-4 pt-4">
                <button type="button" @click="resetForm"
                    class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-gray-100">
                    Сбросить
                </button>
                <button type="submit" :disabled="isSaving"
                    class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all text-white font-medium disabled:opacity-70 disabled:cursor-not-allowed">
                    <span v-if="isSaving">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Сохранение...
                    </span>
                    <span v-else>Сохранить изменения</span>
                </button>
            </div>
        </form>
    </section>
</template>
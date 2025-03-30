<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
    label: string;
    accept: string;
    maxSize?: number;
}>();

const emit = defineEmits<{
    (e: 'fileSelected', file: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];

        if (props.maxSize && file.size > props.maxSize) {
            alert(`Файл слишком большой. Максимальный размер: ${formatFileSize(props.maxSize)}`);
            if (fileInput.value) fileInput.value.value = '';
            return;
        }

        selectedFile.value = file;
        emit('fileSelected', file);
    }
};

const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;

    if (event.dataTransfer?.files.length) {
        const file = event.dataTransfer.files[0];

        if (props.maxSize && file.size > props.maxSize) {
            alert(`Файл слишком большой. Максимальный размер: ${formatFileSize(props.maxSize)}`);
            return;
        }

        if (fileInput.value) fileInput.value.value = '';
        selectedFile.value = file;
        emit('fileSelected', file);
    }
};

const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const isVideoUpload = computed(() => props.accept.includes('video'));
</script>

<template>
    <div>
        <label class="block text-sm font-medium mb-2 text-gray-200">{{ label }}</label>

        <!-- Drag and Drop area -->
        <div class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all" :class="[
            isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700/50 hover:border-blue-500/50 hover:bg-[#252525]',
            selectedFile ? 'bg-[#252525]' : ''
        ]" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop" @click="triggerFileInput">
            <input type="file" ref="fileInput" :accept="accept" class="hidden" @change="handleFileChange">

            <div v-if="!selectedFile" class="py-6">
                <div class="flex justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="isVideoUpload" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p class="text-gray-300 mb-1">Перетащите файл сюда или нажмите для выбора</p>
                <p class="text-xs text-gray-500">
                    {{ isVideoUpload
                        ? 'Поддерживаемые форматы: MP4, MOV, AVI, MKV'
                        : 'Поддерживаемые форматы: JPG, PNG, GIF'
                    }}
                </p>
                <p class="text-xs text-gray-500 mt-1" v-if="props.maxSize">
                    Максимальный размер: {{ formatFileSize(props.maxSize) }}
                </p>
            </div>

            <div v-else class="py-2 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="p-2 bg-blue-500/20 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="isVideoUpload" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="text-left">
                        <p class="text-sm text-gray-200 truncate max-w-xs">{{ selectedFile.name }}</p>
                        <p class="text-xs text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
                    </div>
                </div>
                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    @click.stop="triggerFileInput">
                    Изменить
                </button>
            </div>
        </div>
    </div>
</template>
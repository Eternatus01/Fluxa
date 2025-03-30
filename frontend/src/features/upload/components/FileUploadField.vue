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
</script>

<template>
    <div>
        <label class="block text-sm font-medium mb-2">{{ label }}</label>
        <input type="file" ref="fileInput" :accept="accept"
            class="w-full p-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            @change="handleFileChange">
        <p v-if="selectedFile" class="text-sm text-gray-400 mt-1">
            Выбран файл: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
        </p>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    currentThumbnail: string;
}>();

const emit = defineEmits<{
    (e: 'fileSelected', file: File): void;
}>();

const isDragging = ref(false);

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        emit('fileSelected', input.files[0]);
    }
};

const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;

    if (event.dataTransfer?.files.length) {
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
            emit('fileSelected', file);
        } else {
            alert('Пожалуйста, выберите изображение');
        }
    }
};

const triggerFileInput = () => {
    const fileInput = document.querySelector('#thumbnail-upload') as HTMLInputElement;
    if (fileInput) fileInput.click();
};
</script>

<template>
    <div class="space-y-6">
        <h2 class="text-lg font-semibold text-gray-200 pb-2 border-b border-gray-700/50">Миниатюра</h2>

        <div class="space-y-4">
            <div class="flex flex-wrap gap-4">
                <!-- Текущая миниатюра с превью (уменьшенная) -->
                <div class="relative w-full md:w-64 md:h-36 overflow-hidden rounded-lg shadow-md flex-shrink-0">
                    <img :src="currentThumbnail" class="w-full h-full object-cover" alt="Превью миниатюры">

                    <!-- Overlay для drag-and-drop -->
                    <div class="absolute inset-0 border-2 border-dashed transition-all cursor-pointer flex items-center justify-center"
                        :class="[
                            isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:border-blue-500/50 hover:bg-black/40'
                        ]" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop"
                        @click="triggerFileInput">
                        <div class="bg-black/70 backdrop-blur-sm p-2 rounded-lg" v-if="isDragging">
                            <span class="text-white text-xs">Отпустите файл</span>
                        </div>
                    </div>
                </div>

                <!-- Информация и кнопка загрузки -->
                <div class="flex flex-col justify-between gap-3 flex-1">
                    <div>
                        <p class="text-gray-300 text-sm">Рекомендуемый размер: 1280x720</p>
                        <p class="text-gray-400 text-xs mt-1">Форматы: JPG, PNG, GIF</p>
                    </div>

                    <label
                        class="flex items-center gap-2 px-4 py-2 bg-[#252525] hover:bg-[#303030] rounded-lg transition-colors cursor-pointer text-white self-start">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">Выбрать файл</span>
                        <input id="thumbnail-upload" type="file" accept="image/*" class="hidden"
                            @change="handleFileChange">
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    progress: number;
    isUploading: boolean;
}>();
</script>

<template>
    <div v-if="isUploading" class="mb-6">
        <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-blue-400">Загрузка видео</div>
            <div class="text-sm text-gray-300">{{ progress }}%</div>
        </div>
        <div class="w-full bg-[#252525] rounded-full h-2.5 overflow-hidden">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }">
            </div>
        </div>
        <p class="text-xs text-gray-400 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 animate-spin text-blue-400" viewBox="0 0 24 24"
                fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            Пожалуйста, не закрывайте страницу во время загрузки
        </p>
    </div>
</template>
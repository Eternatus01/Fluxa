<script setup lang="ts">
defineProps<{
    progress: number;
    isUploading: boolean;
}>();
</script>

<template>
    <div v-if="isUploading" class="mb-6">
        <div class="w-full bg-gray-700 rounded-full h-2.5">
            <div class="bg-red-600 h-2.5 rounded-full" :style="{ width: `${progress}%` }"></div>
        </div>
        <p class="text-sm text-gray-400 mt-2">Загрузка: {{ progress }}%</p>
    </div>
</template>
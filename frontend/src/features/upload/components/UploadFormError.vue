<script setup lang="ts">
defineProps<{
    error: Error | null;
}>();
</script>

<template>
    <div v-if="error" class="bg-red-900/70 backdrop-blur-sm text-white p-4 rounded-lg mb-6 border border-red-700/50">
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
                <p class="text-sm text-red-100/80">{{ error.message || 'Произошла ошибка при загрузке видео' }}</p>
            </div>
        </div>
    </div>
</template>
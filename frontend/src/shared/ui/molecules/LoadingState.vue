<script setup lang="ts">
defineProps<{
    message?: string;
}>();
</script>

<template>
    <div
        class="flex flex-col justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-50">
        <div class="w-12 h-12 mb-4">
            <svg class="animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>
        <p class="text-gray-400 text-lg">{{ message || 'Загрузка...' }}</p>
    </div>
</template>
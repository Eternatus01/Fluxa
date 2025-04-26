<script setup lang="ts">
defineProps<{
    message: string;
}>();
</script>

<template>
    <div class="flex flex-col justify-center items-center py-16">
        <div class="w-12 h-12 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" class="w-full h-full">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </div>
        <p class="text-red-500 text-lg mb-2">Произошла ошибка</p>
        <p class="text-gray-400 text-center max-w-md px-4">{{ message }}</p>
    </div>
</template>
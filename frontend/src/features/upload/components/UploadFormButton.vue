<script setup lang="ts">
defineProps<{
    isLoading: boolean;
}>();
</script>

<template>
    <button
        class="cursor-pointer w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="isLoading">
        <span v-if="isLoading">Загрузка...</span>
        <span v-else>Загрузить видео</span>
    </button>
</template>
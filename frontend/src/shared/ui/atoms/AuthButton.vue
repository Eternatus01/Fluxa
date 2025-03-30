<script setup lang="ts">
interface Props {
    isLoading?: boolean;
    text: string;
    loadingText?: string;
}

withDefaults(defineProps<Props>(), {
    loadingText: 'Загрузка...',
    isLoading: false
});
</script>

<template>
    <button type="submit" :disabled="isLoading"
        class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-lg font-semibold transition-colors">
        {{ isLoading ? loadingText : text }}
    </button>
</template>
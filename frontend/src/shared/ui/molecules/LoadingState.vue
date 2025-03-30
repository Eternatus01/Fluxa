<script setup lang="ts">
defineProps<{
    message?: string;
}>();
</script>

<template>
    <div class="flex justify-center items-center h-64">
        <p class="text-white text-xl">{{ message || 'Загрузка...' }}</p>
    </div>
</template>
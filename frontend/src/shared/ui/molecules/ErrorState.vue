<script setup lang="ts">
defineProps<{
    message: string;
}>();
</script>

<template>
    <div class="flex justify-center items-center h-64 flex-col">
        <p class="text-red-500 text-xl mb-4">{{ message }}</p>
    </div>
</template>
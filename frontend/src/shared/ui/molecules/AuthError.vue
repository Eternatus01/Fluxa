<script setup lang="ts">
interface Props {
    error: { message: string } | null;
}

defineProps<Props>();
</script>

<template>
    <p v-if="error" class="text-red-500 text-sm">{{ error.message }}</p>
</template>
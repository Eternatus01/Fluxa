<template>
    <img :src="src" class="w-10 h-10 rounded-full object-cover" alt="User Avatar">
</template>

<script setup>
defineProps({
    src: {
        type: String,
        required: true,
    },
});
</script>
<template>
    <span>{{ timeAgo(date) }}</span>
</template>

<script setup>
import { timeAgo } from './../../../widgets/timeAgo';

defineProps({
    date: {
        type: String,
        required: true,
    },
});
</script>
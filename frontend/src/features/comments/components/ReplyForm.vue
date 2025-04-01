<script setup lang="ts">
import CommentForm from './CommentForm.vue';

const props = defineProps<{
    videoId: string;
    parentId: string;
}>();

const emit = defineEmits<{
    (e: 'success'): void;
    (e: 'cancel'): void;
}>();
</script>

<template>
    <div class="mt-4">
        <CommentForm :videoId="videoId" :parentId="parentId" placeholder="Напишите ответ..." :rows="3"
            @success="emit('success')" />
    </div>
</template>
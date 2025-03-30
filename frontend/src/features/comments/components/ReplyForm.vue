<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/shared/ui/atoms/Button.vue';

const emit = defineEmits<{
    (e: 'submit', text: string): void;
    (e: 'cancel'): void;
}>();

const replyText = ref('');

const handleSubmit = () => {
    if (replyText.value.trim() === '') return;
    emit('submit', replyText.value);
    replyText.value = '';
};
</script>

<template>
    <div class="mt-4">
        <textarea v-model="replyText" placeholder="Напишите ответ..."
            class="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-purple-600 resize-none"></textarea>
        <div class="flex gap-2 mt-2">
            <Button text="Ответить" variant="primary" @click="handleSubmit" />
            <Button text="Отмена" variant="secondary" @click="$emit('cancel')" />
        </div>
    </div>
</template>
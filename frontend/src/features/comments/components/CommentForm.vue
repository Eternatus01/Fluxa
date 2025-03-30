<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/shared/ui/atoms/Button.vue';

const emit = defineEmits<{
  (e: 'submit', text: string): void;
}>();

const commentText = ref('');

const handleSubmit = () => {
  if (commentText.value.trim() === '') return;
  emit('submit', commentText.value);
  commentText.value = '';
};
</script>

<template>
  <div class="mb-6">
    <textarea v-model="commentText" placeholder="Оставьте комментарий..."
      class="w-full text-white border-b mb-2 border-gray-700 focus:outline-none focus:border-purple-600 resize-none">
    </textarea>
    <Button @click="handleSubmit" text="Отправить" variant="primary" />
  </div>
</template>
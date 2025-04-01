<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCommentsStore } from '../stores/commentsStore';
import { DEFAULT_LIMITS } from '../utils/commentLimits';
import { useUserStore } from '@/features/user/stores/userStore';

const props = defineProps<{
  videoId: string;
  parentId?: string;
  placeholder?: string;
  rows?: number;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const commentsStore = useCommentsStore();
const userStore = useUserStore();
const commentText = ref('');
const isSubmitting = ref(false);

const error = computed(() => commentsStore.error?.message);

const isValid = computed(() => {
  return commentText.value.length >= DEFAULT_LIMITS.minLength &&
    commentText.value.length <= DEFAULT_LIMITS.maxLength;
});

async function handleSubmit() {
  if (!isValid.value || !userStore.user) return;

  isSubmitting.value = true;
  try {
    const success = await commentsStore.addComment(
      props.videoId,
      userStore.user.id,
      commentText.value,
      props.parentId
    );

    if (success) {
      commentText.value = '';
      emit('success');
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="bg-[#1e1e1e]/60 rounded-lg p-4 mb-4">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <textarea v-model="commentText" :placeholder="placeholder"
          class="w-full bg-[#252525] text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          :rows="rows" :maxlength="DEFAULT_LIMITS.maxLength" :disabled="isSubmitting"></textarea>
        <div class="flex justify-between items-center mt-1 text-sm text-gray-400">
          <span>{{ commentText.length }}/{{ DEFAULT_LIMITS.maxLength }}</span>
          <span v-if="commentText.length < DEFAULT_LIMITS.minLength" class="text-red-500">
            Минимум {{ DEFAULT_LIMITS.minLength }} символа
          </span>
        </div>
      </div>

      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>

      <div class="flex justify-between items-center">
        <!-- <div class="text-sm text-gray-400">
          <p>• Минимум {{ DEFAULT_LIMITS.minLength }} символа</p>
          <p>• Максимум {{ DEFAULT_LIMITS.maxLength }} символов</p>
          <p>• Не более {{ DEFAULT_LIMITS.maxLinksPerComment }} ссылок</p>
          <p>• Интервал между комментариями: {{ DEFAULT_LIMITS.minInterval / 1000 }} сек</p>
        </div> -->
        <button type="submit" :disabled="isSubmitting || !isValid"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
        </button>
      </div>
    </form>
  </div>
</template>
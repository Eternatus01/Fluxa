<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    id: string;
    label: string;
    hint?: string;
    accept?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: 'change', event: Event): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const handleClick = () => {
    fileInput.value?.click();
};

const handleChange = (event: Event) => {
    emit('change', event);
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <input ref="fileInput" :id="id" type="file" :accept="accept || 'image/*'" class="hidden" :disabled="disabled"
            @change="handleChange">

        <button type="button" @click="handleClick"
            class="py-2 bg-red-600 disabled:bg-gray-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
            :disabled="disabled">
            {{ label }}
        </button>

        <p v-if="hint" class="text-sm text-white/60">
            {{ hint }}
        </p>
    </div>
</template>
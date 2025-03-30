<script setup lang="ts">
interface Props {
    type: 'text' | 'email' | 'password';
    modelValue: string;
    placeholder: string;
}

defineProps<Props>();
defineEmits(['update:modelValue']);
</script>

<template>
    <input :type="type" :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder"
        class="w-full bg-gray-800 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
</template>
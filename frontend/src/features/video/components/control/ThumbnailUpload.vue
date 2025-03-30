<script setup lang="ts">
const props = defineProps<{
    currentThumbnail: string;
}>();

const emit = defineEmits<{
    (e: 'fileSelected', file: File): void;
}>();

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        emit('fileSelected', input.files[0]);
    }
};
</script>

<template>
    <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-300">Миниатюра</h2>

        <div class="flex flex-col items-start gap-4">
            <img :src="currentThumbnail"
                class="w-64 h-36 object-cover rounded-lg border-2 border-dashed border-gray-600" alt="Превью миниатюры">
            <label class="cursor-pointer">
                <span class="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    Выбрать файл
                </span>
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange">
            </label>
        </div>
    </div>
</template>
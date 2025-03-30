<script setup lang="ts">
import { useUserStore } from '@/features/user/stores/userStore';
import { useChangeStore } from '../stores/changeStore';
import { storeToRefs } from 'pinia';
import ImageUpload from '@/shared/ui/atoms/ImageUpload.vue';

const props = defineProps<{
    bannerUrl?: string;
}>();

const emit = defineEmits<{
    (e: 'update', data: { type: string, value: string }): void;
}>();

const userStore = useUserStore();
const changeStore = useChangeStore();
const { isUpdatingBunnerUrl, updateBunnerUrlError } = storeToRefs(changeStore);

const handleBannerChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && userStore.user_id) {
        try {
            const filePath = `${userStore.user_id}/${file.name}`;
            await changeStore.updateBunnerUrl({
                id: userStore.user_id,
                filePath,
                file
            });

            await userStore.fetchUser();
            emit('update', { type: 'banner', value: URL.createObjectURL(file) });
            input.value = '';
        } catch (error) {
            // Ошибка обрабатывается в сторе
        }
    }
};
</script>

<template>
    <div>
        <h2 class="text-xl font-semibold text-white mb-4">Баннер канала</h2>
        <div class="space-y-4">
            <div class="relative group">
                <div class="aspect-[16/9] bg-dark-300 rounded-lg overflow-hidden">
                    <img class="w-full h-full object-contain transition-all duration-200 group-hover:brightness-75"
                        :src="bannerUrl || '/default-banner.jpg'" alt="Channel Banner">
                </div>
                <div
                    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white text-sm text-center px-2">Нажмите для изменения</span>
                </div>
            </div>
            <div>
                <ImageUpload id="banner-upload" label="Загрузить новое" hint="Рекомендуемый размер: 1920x1080px"
                    @change="handleBannerChange" :disabled="isUpdatingBunnerUrl" class="w-full" />
                <p class="text-white/60 text-sm mt-2">
                    Загрузите изображение в формате JPG или PNG. Максимальный размер файла: 5MB
                </p>
                <p v-if="updateBunnerUrlError" class="text-red-500 text-sm mt-2">
                    {{ updateBunnerUrlError.message }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
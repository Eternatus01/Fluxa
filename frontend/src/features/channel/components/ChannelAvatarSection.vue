<script setup lang="ts">
import { useUserStore } from '@/features/user/stores/userStore';
import { useChangeStore } from '../stores/changeStore';
import { storeToRefs } from 'pinia';
import ImageUpload from '@/shared/ui/atoms/ImageUpload.vue';

const props = defineProps<{
    avatarUrl?: string;
}>();

const emit = defineEmits<{
    (e: 'update', data: { type: string, value: string }): void;
}>();

const userStore = useUserStore();
const changeStore = useChangeStore();
const { isUpdatingAvatarUrl, updateAvatarUrlError } = storeToRefs(changeStore);

const handleAvatarChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && userStore.user_id) {
        try {
            const filePath = `${userStore.user_id}/${file.name}`;
            await changeStore.updateAvatarUrl({
                id: userStore.user_id,
                filePath,
                file
            });

            await userStore.fetchUser();
            emit('update', { type: 'avatar', value: URL.createObjectURL(file) });
            input.value = '';
        } catch (error) {
            // Ошибка обрабатывается в сторе
        }
    }
};
</script>

<template>
    <div>
        <h2 class="text-xl font-semibold text-white mb-4">Аватар канала</h2>
        <div class="space-y-4">
            <div class="flex items-center gap-6">
                <div class="relative group w-28 h-28">
                    <img :src="avatarUrl || '/default-avatar.jpg'" class="w-full h-full rounded-lg"
                        alt="Channel Avatar">
                </div>
                <div class="flex-1">
                    <ImageUpload id="avatar-upload" label="Загрузить новое" hint="Рекомендуемый размер: 800x800px"
                        @change="handleAvatarChange" :disabled="isUpdatingAvatarUrl" class="w-full" />
                    <p class="text-white/60 text-sm mt-2">
                        Загрузите изображение в формате JPG или PNG. Максимальный размер файла: 2MB
                    </p>
                    <p v-if="updateAvatarUrlError" class="text-red-500 text-sm mt-2">
                        {{ updateAvatarUrlError.message }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
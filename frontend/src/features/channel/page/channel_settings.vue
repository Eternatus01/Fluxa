<template>
    <div class="min-h-screen bg-[#0f0f0f]">
        <LoadingState v-if="uiStore.isLoading" />
        <div v-else class="container mx-auto px-4 py-8">
            <h1 class="text-2xl font-medium text-white mb-6">Настройки канала</h1>

            <div class="settings-form">
                <!-- Форма настроек канала -->
                <div class="space-y-5">
                    <!-- Основные поля -->
                    <div class="flex flex-col md:flex-row gap-6">
                        <!-- Превью канала с возможностью загрузки аватара и баннера -->
                        <div class="w-full md:w-1/3">
                            <div class="channel-preview bg-dark-200 rounded-lg overflow-hidden">
                                <div class="banner-container relative mb-2">
                                    <div class="w-full h-64 overflow-hidden">
                                        <img :src="channelBanner || '/default-banner.jpg'"
                                            class="w-full h-full object-cover" alt="Баннер канала">
                                    </div>

                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                    <!-- Информация о канале поверх баннера -->
                                    <div class="overlay-info">
                                        <div class="flex items-center">
                                            <div class="avatar-container mr-3">
                                                <img :src="channelAvatar || '/default-avatar.jpg'"
                                                    class="w-12 h-12 rounded-full object-cover" alt="Аватар канала">
                                            </div>
                                            <div>
                                                <h3 class="text-lg font-medium text-white">{{ channelName || `Название
                                                    канала` }}</h3>
                                                <p class="text-white/60 text-sm">@{{ userStore.user?.username ||
                                                    '@username' }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Дополнительная информация и подсказки -->
                                <div class="p-3 text-sm text-white/60">
                                    <p>Так будет выглядеть ваш канал после сохранения изменений</p>
                                </div>
                            </div>
                        </div>

                        <!-- Поля настроек -->
                        <div class="w-full md:w-2/3 space-y-8">

                            <!-- Название канала -->
                            <div>
                                <label for="channelName" class="block text-white mb-2 font-medium">Название
                                    канала</label>
                                <ChannelNameSection ref="channelNameSectionRef" :initial-channel-name="channelName"
                                    @update="updatePreview" />
                            </div>

                            <!-- Аватар канала - в стиле create-playlist -->
                            <div>
                                <label for="avatar-upload" class="block text-white mb-2 font-medium">Аватар
                                    канала</label>

                                <div
                                    class="aspect-square w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center relative group border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors cursor-pointer overflow-hidden">
                                    <label
                                        class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10">
                                        <div v-if="channelAvatar" class="absolute inset-0">
                                            <img :src="channelAvatar" alt="Аватар канала"
                                                class="object-cover w-full h-full rounded-full" />
                                            <div
                                                class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white mb-1"
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span class="text-white text-xs font-medium">Изменить аватар</span>
                                            </div>
                                        </div>
                                        <div v-else class="flex flex-col items-center justify-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-1" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span class="text-xs">Загрузить аватар</span>
                                        </div>
                                        <input type="file" accept="image/*"
                                            class="absolute inset-0 opacity-0 cursor-pointer"
                                            @change="handleAvatarChange" id="avatar-upload" />
                                    </label>
                                </div>

                                <p class="text-gray-400 text-xs mt-2">Рекомендуемый размер: 800x800 пикселей. JPG или
                                    PNG до 2MB.</p>
                            </div>

                            <!-- Баннер канала - в стиле create-playlist -->
                            <div>
                                <label for="banner-upload" class="block text-white mb-2 font-medium">Баннер
                                    канала</label>

                                <div
                                    class="aspect-video bg-gray-800 rounded-md flex items-center justify-center relative group border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
                                    <label
                                        class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10">
                                        <div v-if="channelBanner" class="absolute inset-0">
                                            <img :src="channelBanner" alt="Баннер канала"
                                                class="object-cover w-full h-full rounded-md" />
                                            <div
                                                class="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    class="h-10 w-10 text-white mb-2" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                                </svg>
                                                <span class="text-white font-medium">Заменить баннер</span>
                                            </div>
                                        </div>
                                        <div v-else class="flex flex-col items-center justify-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                                            </svg>
                                            <span class="font-medium">Загрузить баннер</span>
                                            <span class="text-xs text-gray-500 mt-1">JPG, PNG, до 5MB</span>
                                        </div>
                                        <input type="file" accept="image/*"
                                            class="absolute inset-0 opacity-0 cursor-pointer"
                                            @change="handleBannerChange" id="banner-upload" />
                                    </label>
                                </div>

                                <p class="text-gray-400 text-xs mt-2">Рекомендуемый размер: 2560 x 1440 пикселей для
                                    лучшего отображения на всех устройствах.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Сообщение об ошибке -->
                    <div v-if="error" class="text-red-500 bg-red-500/10 p-3 rounded-md">
                        {{ error }}
                    </div>

                    <!-- Кнопки действий -->
                    <div class="flex justify-end space-x-3 mt-6">
                        <router-link to="/"
                            class="px-4 py-2 border border-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                            Отмена
                        </router-link>
                        <button @click="saveChannelSettings"
                            class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            :disabled="uiStore.isLoading || !hasUnsavedChanges">
                            <span v-if="uiStore.isLoading">Сохранение...</span>
                            <span v-else>Сохранить изменения</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useUserStore } from '@/features/user/stores/userStore'
import ChannelNameSection from '../components/ChannelNameSection.vue'
import { ChannelPreviewData, ChannelPreviewUpdate } from '../types/channelTypes'
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import { useChangeStore } from '../stores/changeStore';
import { FileUploadParams, ChannelNameParams } from '../types/channelTypes';

const userStore = useUserStore()
const uiStore = useUiStore();
const changeStore = useChangeStore();

// Ref для доступа к методам компонента ChannelNameSection
const channelNameSectionRef = ref<{ getChannelName: () => string | null } | null>(null);

// Локальное состояние для предпросмотра и отслеживания изменений
const previewData = ref<ChannelPreviewData>({
    channelName: '',
    avatarUrl: '',
    bannerUrl: ''
})

// Временные файлы для загрузки
const tempFiles = reactive({
    avatarFile: null as File | null,
    bannerFile: null as File | null
})

// Флаги для отслеживания изменений
const changes = reactive({
    nameChanged: false,
    avatarChanged: false,
    bannerChanged: false
})

// Исходные данные
const channelAvatar = computed(() => previewData.value.avatarUrl || userStore.avatar_url)
const channelBanner = computed(() => previewData.value.bannerUrl || userStore.bunner_url)
const channelName = computed(() => previewData.value.channelName || userStore.channel_name)
const error = ref<string | null>(null);

// Обновление предпросмотра
const updatePreview = (data: ChannelPreviewUpdate) => {
    switch (data.type) {
        case 'name':
            previewData.value.channelName = data.value
            changes.nameChanged = true
            break
        case 'avatar':
            previewData.value.avatarUrl = data.value
            changes.avatarChanged = true
            break
        case 'banner':
            previewData.value.bannerUrl = data.value
            changes.bannerChanged = true
            break
    }
}

// Функция для обработки загрузки аватара
const handleAvatarChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && userStore.user_id) {
        tempFiles.avatarFile = file;
        updatePreview({ type: 'avatar', value: URL.createObjectURL(file) });
    }
};

// Функция для обработки загрузки баннера
const handleBannerChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && userStore.user_id) {
        tempFiles.bannerFile = file;
        updatePreview({ type: 'banner', value: URL.createObjectURL(file) });
    }
};

// Сохранение имени канала
const saveChannelName = async () => {
    if (!channelNameSectionRef.value || !userStore.user_id) return;

    try {
        // Получаем имя канала из компонента
        const channelName = channelNameSectionRef.value.getChannelName();

        if (!channelName) return;

        const params: ChannelNameParams = {
            id: userStore.user_id,
            channelName
        };

        await changeStore.updateChannelName(params);
        changes.nameChanged = false;
    } catch (error) {
        throw error;
    }
};

// Сохранение аватара
const saveAvatar = async () => {
    if (!tempFiles.avatarFile || !userStore.user_id) return;

    try {
        const filePath = `${userStore.user_id}/${tempFiles.avatarFile.name}`;

        const params: FileUploadParams = {
            id: userStore.user_id,
            filePath,
            file: tempFiles.avatarFile
        };

        await changeStore.updateAvatarUrl(params);
        tempFiles.avatarFile = null;
        changes.avatarChanged = false;
    } catch (error) {
        throw error;
    }
};

// Сохранение баннера
const saveBanner = async () => {
    if (!tempFiles.bannerFile || !userStore.user_id) return;

    try {
        const filePath = `${userStore.user_id}/${tempFiles.bannerFile.name}`;

        const params: FileUploadParams = {
            id: userStore.user_id,
            filePath,
            file: tempFiles.bannerFile
        };

        await changeStore.updateBannerUrl(params);
        tempFiles.bannerFile = null;
        changes.bannerChanged = false;
    } catch (error) {
        throw error;
    }
};

// Функция сохранения всех настроек канала
const saveChannelSettings = async () => {
    try {
        uiStore.isLoading = true;
        error.value = null;

        // Сохраняем все изменения
        const savePromises = [];

        // Сохраняем имя канала, если оно было изменено
        if (changes.nameChanged) {
            savePromises.push(saveChannelName());
        }

        // Сохраняем аватар, если он был изменен
        if (changes.avatarChanged && tempFiles.avatarFile) {
            savePromises.push(saveAvatar());
        }

        // Сохраняем баннер, если он был изменен
        if (changes.bannerChanged && tempFiles.bannerFile) {
            savePromises.push(saveBanner());
        }

        await Promise.all(savePromises);

        // Обновляем данные пользователя после всех сохранений
        await userStore.fetchUser();

        // Сбрасываем флаги изменений
        changes.nameChanged = false;
        changes.avatarChanged = false;
        changes.bannerChanged = false;

        // Уведомление об успешном сохранении
        console.log('Настройки канала успешно сохранены');
    } catch (err) {
        // Уведомление об ошибке
        console.error('Не удалось сохранить настройки', err);
        error.value = err instanceof Error ? err.message : 'Произошла ошибка при сохранении настроек';
    } finally {
        uiStore.isLoading = false;
    }
}

// Проверка наличия несохраненных изменений
const hasUnsavedChanges = computed(() => {
    return changes.nameChanged || changes.avatarChanged || changes.bannerChanged;
});
</script>

<style scoped>
/* Анимации и переходы */
.settings-form {
    animation: fadeIn 0.5s ease-out;
}

/* Стили из ChannelHeader, адаптированные для превью */
.banner-container {
    position: relative;
    width: 100%;
    border-radius: 0.25rem;
    overflow: hidden;
}

.overlay-info {
    position: absolute;
    bottom: 0.75rem;
    left: 0.75rem;
    z-index: 10;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
import { useChangeApi } from "../composable/useChangeApi";
import { defineStore } from 'pinia';
import { useUserStore } from "../../user/stores/userStore";
import { ref, computed } from "vue";
import {
    FileUploadParams,
    ChannelNameParams,
    ChannelError,
    ChannelState
} from '../types/channelTypes';

export const useChangeStore = defineStore("change", () => {
    const changeApi = useChangeApi();
    const userStore = useUserStore();

    const isUpdatingAvatarUrl = ref<boolean>(false);
    const isUpdatingBannerUrl = ref<boolean>(false);
    const isUpdatingChannelName = ref<boolean>(false);
    const updateAvatarUrlError = ref<ChannelError | null>(null);
    const updateBannerUrlError = ref<ChannelError | null>(null);
    const updateChannelNameError = ref<ChannelError | null>(null);

    const updateAvatarUrl = async ({ id, filePath, file }: FileUploadParams): Promise<void> => {
        isUpdatingAvatarUrl.value = true;
        updateAvatarUrlError.value = null;
        try {
            if (!id) {
                const error: ChannelError = {
                    message: 'ID пользователя не указан',
                    status: 400,
                    field: 'id'
                };
                throw error;
            }
            const avatarUrl = await changeApi.changeAvatar(id, filePath, file);
            userStore.setAvatar(avatarUrl);
        } catch (error) {
            updateAvatarUrlError.value = error as ChannelError;
            throw error;
        } finally {
            isUpdatingAvatarUrl.value = false;
        }
    };

    const updateBannerUrl = async ({ id, filePath, file }: FileUploadParams): Promise<void> => {
        isUpdatingBannerUrl.value = true;
        updateBannerUrlError.value = null;
        try {
            if (!id) {
                const error: ChannelError = {
                    message: 'ID пользователя не указан',
                    status: 400,
                    field: 'id'
                };
                throw error;
            }
            const bannerUrl = await changeApi.changeBunner(id, filePath, file);
            userStore.setBunner(bannerUrl);
        } catch (error) {
            updateBannerUrlError.value = error as ChannelError;
            throw error;
        } finally {
            isUpdatingBannerUrl.value = false;
        }
    };

    const updateChannelName = async ({ id, channelName }: ChannelNameParams): Promise<void> => {
        isUpdatingChannelName.value = true;
        updateChannelNameError.value = null;

        try {
            if (!id) {
                const error: ChannelError = {
                    message: 'ID пользователя не указан',
                    status: 400,
                    field: 'id'
                };
                throw error;
            }

            if (!channelName || channelName.trim() === '') {
                const error: ChannelError = {
                    message: 'Название канала не может быть пустым',
                    status: 400,
                    field: 'channelName'
                };
                throw error;
            }

            const newChannelName = await changeApi.updateChannelName(id, channelName);

            userStore.setChannelName(newChannelName);
        } catch (error) {
            console.error('Ошибка в changeStore.updateChannelName:', error);
            updateChannelNameError.value = error as ChannelError;
            throw error;
        } finally {
            isUpdatingChannelName.value = false;
        }
    };

    return {
        updateAvatarUrl,
        updateBannerUrl,
        updateChannelName,
        isUpdatingAvatarUrl: computed(() => isUpdatingAvatarUrl.value),
        isUpdatingBannerUrl: computed(() => isUpdatingBannerUrl.value),
        isUpdatingChannelName: computed(() => isUpdatingChannelName.value),
        updateAvatarUrlError: computed(() => updateAvatarUrlError.value),
        updateBannerUrlError: computed(() => updateBannerUrlError.value),
        updateChannelNameError: computed(() => updateChannelNameError.value),
    };
});
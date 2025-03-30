import { useChangeApi } from "../composable/useChangeApi";
import { defineStore } from 'pinia';
import { useUserStore } from "../../user/stores/userStore";
import { ref, computed } from "vue";

interface FilePath {
    filePath: string;
    id: string;
    file: File;
}

interface NameData {
    channelName: string;
    id: string;
}

export const useChangeStore = defineStore("change", () => {
    const changeApi = useChangeApi();
    const userStore = useUserStore();

    const isUpdatingAvatarUrl = ref(false);
    const isUpdatingBunnerUrl = ref(false);
    const isUpdatingChannelName = ref(false);
    const updateAvatarUrlError = ref<Error | null>(null);
    const updateBunnerUrlError = ref<Error | null>(null);
    const updateChannelNameError = ref<Error | null>(null);

    const updateAvatarUrl = async ({ id, filePath, file }: FilePath): Promise<void> => {
        isUpdatingAvatarUrl.value = true;
        updateAvatarUrlError.value = null;
        try {
            if (!id) {
                throw new Error('ID пользователя не указан');
            }
            const avatarUrl = await changeApi.changeAvatar(id, filePath, file);
            userStore.setAvatar(avatarUrl);
        } catch (error) {
            updateAvatarUrlError.value = error as Error;
            throw error;
        } finally {
            isUpdatingAvatarUrl.value = false;
        }
    };

    const updateBunnerUrl = async ({ id, filePath, file }: FilePath): Promise<void> => {
        isUpdatingBunnerUrl.value = true;
        updateBunnerUrlError.value = null;
        try {
            const bunnerUrl = await changeApi.changeBunner(id, filePath, file);
            userStore.setBunner(bunnerUrl);
        } catch (error) {
            updateBunnerUrlError.value = error as Error;
            throw error;
        } finally {
            isUpdatingBunnerUrl.value = false;
        }
    };

    const updateChannelName = async ({ id, channelName }: NameData): Promise<void> => {
        isUpdatingChannelName.value = true;
        updateChannelNameError.value = null;

        try {
            if (!id) {
                throw new Error('ID пользователя не указан');
            }

            if (!channelName || channelName.trim() === '') {
                throw new Error('Название канала не может быть пустым');
            }

            const newChannelName = await changeApi.updateChannelName(id, channelName);

            userStore.setChannelName(newChannelName);
        } catch (error) {
            console.error('Ошибка в changeStore.updateChannelName:', error);
            updateChannelNameError.value = error as Error;
            throw error;
        } finally {
            isUpdatingChannelName.value = false;
        }
    };

    return {
        updateAvatarUrl,
        updateBunnerUrl,
        updateChannelName,
        isUpdatingAvatarUrl: computed(() => isUpdatingAvatarUrl.value),
        isUpdatingBunnerUrl: computed(() => isUpdatingBunnerUrl.value),
        isUpdatingChannelName: computed(() => isUpdatingChannelName.value),
        updateAvatarUrlError: computed(() => updateAvatarUrlError.value),
        updateBunnerUrlError: computed(() => updateBunnerUrlError.value),
        updateChannelNameError: computed(() => updateChannelNameError.value),
    };
});
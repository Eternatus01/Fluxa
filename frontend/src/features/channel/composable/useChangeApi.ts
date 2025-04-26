import { apiClient } from './../../../widgets/apiClient';
import { invalidateApiCache } from '../../../shared/api/apiClientWithCache';
import { useUserStore } from '../../user/stores/userStore';
import {
    ChannelId,
    ChannelName,
    AvatarResponse,
    BannerResponse,
    ChannelNameResponse,
    ChannelError,
    ImageUrl
} from '../types/channelTypes';
import { UserId, Username } from '../../user/types/userTypes';

// Определяем тип для ошибок API
interface ErrorMessage {
    message?: string;
    status?: number;
    field?: string;
    code?: string;
}

export const useChangeApi = () => {
    const userStore = useUserStore();

    const changeAvatar = async (id: ChannelId, filePath: string, file: File): Promise<string> => {
        try {
            const storagePostData = new FormData();
            storagePostData.append('file', file);
            storagePostData.append('filePath', filePath);

            // Загружаем файл в хранилище
            await apiClient('/api/storage/avatar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: storagePostData,
            });

            const avatarUrl = `https://zldqqthnfodtqdcfezap.supabase.co/storage/v1/object/public/Avatars/${filePath}`;

            // Обновляем URL аватара в профиле пользователя
            const { avatar_url } = await apiClient<AvatarResponse>('/api/change/avatar', {
                method: 'PATCH',
                data: {
                    id,
                    avatar_url: avatarUrl,
                },
            });

            // Обновляем локальное состояние
            userStore.setAvatar(avatar_url);
            invalidateApiCache('/me', { method: 'GET' }, 'user:currentUser');
            return avatar_url;
        } catch (error) {
            const err = error as ErrorMessage;
            const channelError: ChannelError = {
                message: err?.message || 'Не удалось изменить аватар',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw channelError;
        }
    };

    const changeBunner = async (id: ChannelId, filePath: string, file: File): Promise<string> => {
        try {
            const storagePostData = new FormData();
            storagePostData.append('file', file);
            storagePostData.append('filePath', filePath);

            // Загружаем файл в хранилище
            await apiClient('/api/storage/bunner', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: storagePostData,
            });

            const bunnerUrl = `https://zldqqthnfodtqdcfezap.supabase.co/storage/v1/object/public/Bunners/${filePath}`;

            // Обновляем URL баннера в профиле пользователя
            const { bunner_url } = await apiClient<BannerResponse>('/api/change/bunner', {
                method: 'PATCH',
                data: {
                    id,
                    bunner_url: bunnerUrl,
                },
            });

            // Обновляем локальное состояние
            userStore.setBunner(bunner_url);            
            invalidateApiCache('/me', { method: 'GET' }, 'user:currentUser');

            return bunner_url;
        } catch (error) {
            const err = error as ErrorMessage;
            const channelError: ChannelError = {
                message: err?.message || 'Не удалось изменить баннер',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw channelError;
        }
    };

    const updateChannelName = async (id: ChannelId, channelName: ChannelName): Promise<string> => {
        try {
            // Обновляем название канала в профиле пользователя
            const response = await apiClient<ChannelNameResponse>('/api/change/channel_name', {
                method: 'PATCH',
                data: {
                    id,
                    channel_name: channelName,
                },
            });

            // Инвалидируем кэш пользователя
            invalidateApiCache('/me', { method: 'GET' }, 'user:currentUser');

            return response.channel_name;
        } catch (error) {
            const err = error as ErrorMessage;
            const channelError: ChannelError = {
                message: err?.message || 'Не удалось изменить название канала',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw channelError;
        }
    };

    // Вспомогательная функция для инвалидации кэша пользователя
    const invalidateUserCache = (userId: UserId, username?: Username | null) => {
        // Инвалидируем кэш текущего пользователя
        invalidateApiCache('http://localhost:3001/api/user/me', { method: 'GET' }, 'user:current');

        // Инвалидируем кэш пользователя по ID
        invalidateApiCache(`http://localhost:3001/api/user/get/id/${userId}`, { method: 'GET' }, `user:id:${userId}`);

        // Если указано имя пользователя, инвалидируем кэш пользователя по имени
        if (username) {
            invalidateApiCache(`http://localhost:3001/api/user/get/username/${username}`, { method: 'GET' }, `user:username:${username}`);
        }
    };

    return { changeAvatar, changeBunner, updateChannelName };
};
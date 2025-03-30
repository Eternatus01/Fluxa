import { ComputedRef } from 'vue';
import { Store } from 'pinia';
import { UserData, ImageUrl as UserImageUrl } from '../../user/types/userTypes';

// Базовые типы
export type ChannelId = string;
export type ChannelName = string;
export type ChannelDescription = string | null;
export type ImageUrl = UserImageUrl;

// Статусы
export type ChangeStatus = 'idle' | 'loading' | 'success' | 'error';

// Параметры для файлов
export interface FileUploadParams {
    id: ChannelId;
    filePath: string;
    file: File;
}

// Параметры для обновления имени канала
export interface ChannelNameParams {
    id: ChannelId;
    channelName: ChannelName;
}

// Ошибки
export interface ChannelError {
    message: string;
    status?: number;
    field?: string;
    code?: string;
}

// Превью данные
export interface ChannelPreviewData {
    channelName: ChannelName;
    avatarUrl: ImageUrl;
    bannerUrl: ImageUrl;
}

// Обновление превью
export interface ChannelPreviewUpdate {
    type: 'name' | 'avatar' | 'banner';
    value: string;
}

// Общий тип ответа API
export interface ChannelResponse<T> {
    data: T;
    message?: string;
    status: number;
}

// Ответы API
export interface AvatarResponse {
    avatar_url: string;
}

export interface BannerResponse {
    bunner_url: string;
}

export interface ChannelNameResponse {
    channel_name: string;
}

// Состояние хранилища
export interface ChannelState {
    isUpdatingAvatarUrl: boolean;
    isUpdatingBannerUrl: boolean;
    isUpdatingChannelName: boolean;
    updateAvatarUrlError: ChannelError | null;
    updateBannerUrlError: ChannelError | null;
    updateChannelNameError: ChannelError | null;
}

// Используем интерфейс ChannelState для определения типа хранилища
export type ChannelStoreGetters = {
    isUpdatingAvatarUrl: ComputedRef<boolean>;
    isUpdatingBannerUrl: ComputedRef<boolean>;
    isUpdatingChannelName: ComputedRef<boolean>;
    updateAvatarUrlError: ComputedRef<ChannelError | null>;
    updateBannerUrlError: ComputedRef<ChannelError | null>;
    updateChannelNameError: ComputedRef<ChannelError | null>;
};

export type ChannelStoreActions = {
    updateAvatarUrl: (params: FileUploadParams) => Promise<void>;
    updateBannerUrl: (params: FileUploadParams) => Promise<void>;
    updateChannelName: (params: ChannelNameParams) => Promise<void>;
};

export type ChannelStore = Store<"change", ChannelState, ChannelStoreGetters, ChannelStoreActions>;

// Константы
export const CHANNEL_CONSTRAINTS = {
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
        MESSAGE: 'Название канала должно содержать от 2 до 50 символов'
    },
    FILE: {
        MAX_SIZE: 2 * 1024 * 1024, // 2MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
        MESSAGE: 'Файл должен быть в формате JPG или PNG и не превышать 2MB'
    }
} as const; 
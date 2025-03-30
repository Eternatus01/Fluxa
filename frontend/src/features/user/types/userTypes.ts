import type { Store } from 'pinia';
import type { Ref, ComputedRef } from 'vue';

// Базовые типы для пользователя
export type UserId = string;
export type Username = string;
export type ChannelName = string;
export type ImageUrl = string | null;

// Статусы загрузки
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

// Основные данные пользователя
export interface UserData {
  id: UserId;
  username: Username | null;
  channel_name: ChannelName;
  avatar_url: ImageUrl;
  bunner_url: ImageUrl;
  subscribers_count: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Общий тип ответа API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Типизированные ответы API для пользователей
export type UserResponse = ApiResponse<UserData>;
export type UsersResponse = ApiResponse<UserData[]>;

// Ошибки
export interface UserError {
  message: string;
  status: number;
  field?: string;
  code?: string;
}

// Параметры запросов
export interface UpdateUserProfileParams {
  id: UserId;
  username?: Username | null;
  channel_name?: ChannelName;
  avatar_url?: ImageUrl;
  bunner_url?: ImageUrl;
}

export interface UpdateUserAvatarParams {
  id: UserId;
  file: File;
  filePath: string;
}

export interface UpdateUserBannerParams {
  id: UserId;
  file: File;
  filePath: string;
}

export interface GetUserByIdParams {
  id: UserId;
}

export interface GetUsersByIdParams {
  ids: UserId[];
}

export interface GetUserByUsernameParams {
  username: Username;
}

// Кэш пользователей
export interface UsersCache {
  [key: UserId]: UserData;
}

export interface UsernameToIdMap {
  [key: Username]: UserId;
}

// Валидационные константы
export const USER_CONSTRAINTS = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  CHANNEL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
  }
} as const;

// Состояние хранилища
export interface UserState {
  user: UserData | null;
  token: string | null;
  avatar_url: ImageUrl;
  bunner_url: ImageUrl;
  channel_name: ChannelName;
  user_id: UserId;
  usersCache: UsersCache;
  usernameToIdMap: UsernameToIdMap;
  status: LoadingStatus;
  error: UserError | null;
  isLoading: boolean; // Добавлено для совместимости со store
}

// Store types
export type UserStoreGetters = {
  isAuthenticated: ComputedRef<boolean>;
  isLoading: ComputedRef<boolean>;
  user: ComputedRef<UserData | null>;
  token: ComputedRef<string | null>;
  avatar_url: ComputedRef<string>;
  bunner_url: ComputedRef<string>;
  channel_name: ComputedRef<string>;
  user_id: ComputedRef<UserId>;
  error: ComputedRef<UserError | null>;
  usersCache: ComputedRef<UsersCache>;
  username: ComputedRef<Username>;
  subscribers_count: ComputedRef<number>;
};

export type UserStoreActions = {
  updateUserState: (userData: UserData | null) => void;
  clearUser: () => void;
  clearCache: () => void;
  setToken: (token: string | null) => void;
  fetchUser: () => Promise<UserData>;
  getUserById: (userId: UserId) => Promise<UserData>;
  getUsersById: (userIds: UserId[]) => Promise<UserData[]>;
  getUserByUsername: (username: Username) => Promise<UserData>;
  updateUserProfile: (params: UpdateUserProfileParams) => Promise<UserData>;
  setUser: (userData: UserData) => void;
  setAvatar: (url: string) => void;
  setBunner: (url: string) => void;
  setChannelName: (name: ChannelName) => void;
  logout: () => void;
};

export type UserStore = Store<"user", UserState, UserStoreGetters, UserStoreActions>; 
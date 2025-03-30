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
  id: string;
  username: string | null;
  channel_name: string;
  avatar_url: string | null;
  bunner_url: string | null;
  subscribers_count: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Ответы API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface UserResponse extends UserData {
  message?: string;
  status?: number;
}

export interface UsersResponse extends Array<UserData> {
  message?: string;
  status?: number;
}

// Ошибки
export interface UserError {
  message: string;
  status: number;
  field?: string;
  code?: string;
}

// Параметры запросов
export interface UpdateUserProfileParams {
  id: string;
  username?: string;
  channel_name?: string;
  avatar_url?: string | null;
  bunner_url?: string | null;
}

export interface UpdateUserAvatarParams {
  id: string;
  file: File;
  filePath: string;
}

export interface UpdateUserBannerParams {
  id: string;
  file: File;
  filePath: string;
}

export interface GetUserByIdParams {
  id: string;
}

export interface GetUsersByIdParams {
  ids: string[];
}

export interface GetUserByUsernameParams {
  username: string;
}

// Кэш пользователей
export interface UsersCache {
  [key: UserId]: UserData;
}

export interface UsernameToIdMap {
  [key: Username]: UserId;
}

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
}

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
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const
  }
} as const;

// Validation constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Store type
export type UserStoreState = {
  user: UserData | null;
  token: string | null;
  avatar_url: string;
  bunner_url: string;
  channel_name: string;
  user_id: string;
  usersCache: Record<string, UserData>;
  usernameToIdMap: Record<string, string>;
  status: LoadingStatus;
  error: UserError | null;
};

export type UserStoreGetters = {
  isAuthenticated: ComputedRef<boolean>;
  isLoading: ComputedRef<boolean>;
  currentUser: ComputedRef<UserData | null>;
  currentError: ComputedRef<UserError | null>;
};

export type UserStoreActions = {
  updateUserState: (userData: UserData | null) => void;
  clearUser: () => void;
  setToken: (token: string | null) => void;
  fetchUser: () => Promise<UserData>;
  getUserById: (userId: UserId) => Promise<UserData>;
  getUsersById: (userIds: UserId[]) => Promise<UserData[]>;
  getUserByUsername: (username: Username) => Promise<UserData>;
  updateUserProfile: (params: UpdateUserProfileParams) => Promise<UserData>;
};

export type UserStore = Store<"user", UserStoreState, UserStoreGetters, UserStoreActions>; 
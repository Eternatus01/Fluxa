import { UserData, Username, ChannelName } from '../../user/types/userTypes';
import { ComputedRef } from 'vue';
import { Store } from 'pinia';

// Базовые типы
export type AuthToken = string;
export type Email = string;
export type Password = string;

// Статусы аутентификации
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

// Сессия
export interface Session {
    access_token: AuthToken;
    refresh_token?: AuthToken;
    expires_at?: number;
}

// Общий тип ответа API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

// Фактическая структура ответов API
export interface SignUpResponse {
    data: {
        user: UserData;
        token: AuthToken;
        refreshToken: AuthToken;
    };
    message?: string;
    status: number;
}

export interface SignInResponse {
    user: UserData;
    token: AuthToken;
    refreshToken: AuthToken;
    message?: string;
    status: number;
}

// Ответ API при получении текущего пользователя
export interface GetCurrentUserResponse {
    data: UserData;
}

// Параметры запросов
export interface SignUpParams {
    email: Email;
    password: Password;
    username: Username;
    channel_name: ChannelName;
}

export interface SignInParams {
    email: Email;
    password: Password;
}

// Ошибки
export interface AuthError {
    message: string;
    status: number;
    field?: keyof SignUpParams | keyof SignInParams | string;
    code?: string;
}

// Состояние хранилища
export interface AuthState {
    user: UserData | null;
    session: Session | null;
    status: AuthStatus;
    error: AuthError | null;
    isSigningUp: boolean;
    isSigningIn: boolean;
    isSigningOut: boolean;
    isCheckingAuth: boolean;
    signUpError: AuthError | null;
    signInError: AuthError | null;
    signOutError: AuthError | null;
}

// Константы для валидации
export const AUTH_CONSTRAINTS = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 32,
        PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
        MESSAGE: 'Пароль должен содержать минимум 8 символов, включая заглавную букву, строчную букву и цифру'
    },
    EMAIL: {
        PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        MESSAGE: 'Введите корректный email адрес'
    }
} as const;

// Определения для store

// Используем интерфейс AuthState для определения типа хранилища
export type AuthStoreGetters = {
    isSigningUp: ComputedRef<boolean>;
    isSigningIn: ComputedRef<boolean>;
    isSigningOut: ComputedRef<boolean>;
    isCheckingAuth: ComputedRef<boolean>;
    signUpError: ComputedRef<AuthError | null>;
    signInError: ComputedRef<AuthError | null>;
    signOutError: ComputedRef<AuthError | null>;
    isAuthenticated: ComputedRef<boolean>;
};

export type AuthStoreActions = {
    signUp: (params: SignUpParams) => Promise<UserData>;
    signIn: (params: SignInParams) => Promise<UserData>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<UserData | null>;
};

export type AuthStore = Store<"auth", AuthState, AuthStoreGetters, AuthStoreActions>;


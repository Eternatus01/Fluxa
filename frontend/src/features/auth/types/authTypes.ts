import { UserData } from '../../user/types/userTypes';

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

// Ответы API
export interface AuthResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface SignUpResponse {
    data: {
        user: UserData;
        token: string;
        refreshToken: string;
    };
    message?: string;
    status: number;
}

export interface SignInResponse {
    data: {
        user: UserData;
        token: string;
        refreshToken: string;
    };
    message?: string;
    status: number;
}

// Параметры запросов
export interface SignUpParams {
    email: Email;
    password: Password;
    username: string;
    channel_name: string;
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


import { apiClientWithCache, invalidateApiCache } from '../../../shared/api/apiClientWithCache';
import { useApiWithCache } from '../../../shared/composables/useApiWithCache';
import {
    SignUpParams,
    SignInParams,
    SignUpResponse,
    SignInResponse,
    AuthError,
    Email,
    Password,
    ApiResponse,
    GetCurrentUserResponse
} from '../types/authTypes';
import { UserData, ChannelName, Username } from '../../user/types/userTypes';
import { useUserStore } from '@/features/user/stores/userStore';

// Определяем тип для ошибок API
interface ErrorMessage {
    message?: string;
    status?: number;
    field?: string;
    code?: string;
}

export const useAuthApi = () => {
    const api = useApiWithCache('auth', {
        baseUrl: 'http://localhost:3001/api/auth'
    });

    const userApi = useApiWithCache('user', {
        baseUrl: 'http://localhost:3001/api/user'
    });

    // Регистрация
    const signUp = async (
        email: Email,
        password: Password,
        username: Username,
        channel_name: ChannelName
    ): Promise<UserData> => {
        try {
            const postData: SignUpParams = {
                email,
                password,
                username,
                channel_name
            };

            const { data } = await api.post<SignUpResponse>('/signup', postData);

            if (!data.value || !data.value.data || !data.value.data.user) {
                throw new Error('Не удалось получить данные пользователя');
            }

            return data.value.user;
        } catch (error) {
            const err = error as ErrorMessage;
            const authError: AuthError = {
                message: err?.message || 'Не удалось зарегистрироваться',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw authError;
        }
    };

    // Вход
    const signIn = async (email: Email, password: Password): Promise<UserData> => {
        try {
            const postData: SignInParams = {
                email,
                password
            };

            const { data } = await api.post<SignInResponse>('/signin', postData);

            if (!data.value || !data.value.user) {
                throw new Error('Не удалось получить данные пользователя');
            }

            // Сохраняем данные пользователя в кэш для быстрого доступа
            await apiClientWithCache<{ user: UserData }>(
                'http://localhost:3001/api/user/me',
                { method: 'GET' },
                {
                    enabled: true,
                    key: 'user:currentUser',
                    persistent: true,
                    ttl: 24 * 60 * 60 * 1000 // 24 часа
                }
            );
            return data.value.user;
        } catch (error) {
            const err = error as ErrorMessage;
            const authError: AuthError = {
                message: err?.message || 'Неверные учетные данные.',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw authError;
        }
    };

    // Выход
    const signOut = async (): Promise<void> => {
        try {
            await api.post<void>('/signout', {});

            // Инвалидируем кэши текущего пользователя
            invalidateApiCache('http://localhost:3001/api/user/me', { method: 'GET' }, 'user:currentUser');
            invalidateApiCache('http://localhost:3001/api/user/me', { method: 'GET' }, 'user:current');
            localStorage.removeItem('auth_token')
        } catch (error) {
            const err = error as ErrorMessage;
            const authError: AuthError = {
                message: err?.message || 'Не удалось выйти',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw authError;
        }
    };

    // Получение текущего пользователя (с кэшированием)
    const getCurrentUser = async (): Promise<UserData | null> => {
        try {
            // Используем тип GetCurrentUserResponse, который соответствует фактической структуре
            const { data } = await userApi.get<GetCurrentUserResponse>('/me', {}, {
                persistent: true,
                ttl: 24 * 60 * 60 * 1000, // 24 часа
                key: 'user:currentUser'
            });

            if (!data.value) {
                return null;
            }

            // Сохраняем исходную логику, но указываем правильный тип
            // return data.value.data;
            return data.value as unknown as UserData;
        } catch (error) {
            return null;
        }
    };

    return { signUp, signIn, signOut, getCurrentUser };
};
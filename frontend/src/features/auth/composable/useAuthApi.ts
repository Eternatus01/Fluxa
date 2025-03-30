import { apiClientWithCache, invalidateApiCache } from '../../../shared/api/apiClientWithCache';
import { useApiWithCache } from '../../../shared/composables/useApiWithCache';

interface UserData {
    id: string;
    email: string;
    username: string;
    channel_name: string;
    avatar_url?: string;
    bunner_url?: string;
}

interface ErrorMessage {
    message?: string;
}

export const useAuthApi = () => {
    const api = useApiWithCache('auth', {
        baseUrl: 'http://localhost:3001/api/auth'
    });

    const userApi = useApiWithCache('user', {
        baseUrl: 'http://localhost:3001/api/user'
    });

    // Регистрация
    const signUp = async (email: string, password: string, username: string, channel_name: string): Promise<UserData> => {
        try {
            const postData = {
                email: email,
                password: password,
                username: username,
                channel_name: channel_name
            };

            console.log('Отправка данных для регистрации:', postData);

            const { data } = await api.post<{ user: UserData }>('/signup', postData);

            if (!data.value) {
                throw new Error('Не удалось получить данные пользователя');
            }

            return data.value.user;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось зарегистрироваться');
        }
    };

    // Вход
    const signIn = async (email: string, password: string): Promise<UserData> => {
        try {
            const postData = {
                email: email,
                password: password
            };

            console.log('Отправка данных для входа:', postData);

            const { data } = await api.post<{ user: UserData }>('/signin', postData);

            if (!data.value) {
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
            throw new Error(err?.message || 'Неверные учетные данные.');
        }
    };

    // Выход
    const signOut = async (): Promise<void> => {
        try {
            await api.post<void>('/signout', {});
            // Инвалидируем кэши текущего пользователя
            invalidateApiCache('http://localhost:3001/api/user/me', { method: 'GET' }, 'user:currentUser');
            invalidateApiCache('http://localhost:3001/api/user/me', { method: 'GET' }, 'user:current');

            // Чистим все возможные кэши пользователя
            console.log('Очистка всех кэшей пользователя при выходе');
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось выйти');
        }
    };

    // Получение текущего пользователя (с кэшированием)
    const getCurrentUser = async (): Promise<UserData | null> => {
        try {
            const { data } = await userApi.get<UserData | { user: UserData }>('/me', {}, {
                persistent: true,
                ttl: 24 * 60 * 60 * 1000, // 24 часа
                key: 'user:currentUser'
            });

            if (!data.value) {
                return null;
            }

            // Проверяем формат ответа
            if ('user' in data.value) {
                return data.value.user;
            } else if ('id' in data.value) {
                return data.value as UserData;
            }

            return null;
        } catch (error) {
            return null;
        }
    };

    return { signUp, signIn, signOut, getCurrentUser };
};
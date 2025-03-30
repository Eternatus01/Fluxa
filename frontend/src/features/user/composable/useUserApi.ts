import { useApiWithCache } from "../../../shared/composables/useApiWithCache";
import {
    UserData,
    UpdateUserProfileParams,
    ApiResponse,
    UserId,
    Username,
    UserResponse,
    UsersResponse
} from "../types/userTypes";

export const useUserApi = () => {
    const api = useApiWithCache('user', {
        baseUrl: 'http://localhost:3001',
        defaultCacheOptions: {
            enabled: true,
            ttl: 5 * 60 * 1000,
            persistent: true
        }
    });

    const fetchUser = async (): Promise<UserData> => {
        try {
            const { data } = await api.get<ApiResponse<UserData>>('/api/user/me', {}, {
                key: 'user:current',
                ttl: 30 * 60 * 1000
            });

            // Проверяем и извлекаем данные пользователя
            if (!data.value) {
                throw new Error('Не удалось получить данные пользователя');
            }

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const getUserById = async (user_id: UserId): Promise<UserData> => {
        try {
            const { data } = await api.get<ApiResponse<UserData>>(`/api/user/get/id/${user_id}`, { user_id }, {
                key: `user:id:${user_id}`,
                ttl: 30 * 60 * 1000 // 30 минут
            });

            // Проверяем и извлекаем данные пользователя
            if (!data.value) {
                throw new Error(`Не удалось получить пользователя с ID ${user_id}`);
            }

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const getUsersById = async (users_id: UserId[]): Promise<UserData[]> => {
        try {
            // Для массовых запросов используем уникальный ключ на основе отсортированных ID
            const sortedIds = [...users_id].sort().join(',');

            const { data } = await api.get<ApiResponse<UserData[]>>(`/api/user/get/ids`, { users_id }, {
                key: `users:ids:${sortedIds}`,
                ttl: 30 * 60 * 1000 // 30 минут
            });

            // Проверяем и извлекаем данные пользователя
            if (!data.value) {
                throw new Error('Не удалось получить данные пользователей');
            }

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const getUserByUsername = async (username: Username): Promise<UserData> => {
        try {
            const { data } = await api.get<ApiResponse<UserData>>(`/api/user/get/username/${username}`, { username }, {
                key: `user:username:${username}`,
                ttl: 5 * 60 * 1000
            });

            // Проверяем и извлекаем данные пользователя
            if (!data.value) {
                throw new Error(`Не удалось найти пользователя с именем ${username}`);
            }

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    // Метод для обновления данных пользователя
    const updateUserProfile = async (userData: UpdateUserProfileParams): Promise<UserData> => {
        try {
            // Создаем массив путей для инвалидации кэша
            const invalidationPaths: string[] = ['/api/user/me'];

            if (userData.id) {
                invalidationPaths.push(`/api/user/get/id/${userData.id}`);
            }

            if (userData.username) {
                invalidationPaths.push(`/api/user/get/username/${userData.username}`);
            }

            const { data } = await api.put<ApiResponse<UserData>>('/api/user/update', userData, invalidationPaths);

            // Проверяем и извлекаем данные обновленного пользователя
            if (!data.value) {
                throw new Error('Не удалось обновить профиль пользователя');
            }

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    // Метод для инвалидации кэша пользователя
    const invalidateUserCache = (userId?: UserId, username?: Username) => {
        // Инвалидируем кэш текущего пользователя
        api.invalidateCache('/api/user/me');

        // Если указан ID, инвалидируем кэш пользователя по ID
        if (userId) {
            api.invalidateCache(`/api/user/get/id/${userId}`);
        }

        // Если указано имя пользователя, инвалидируем кэш пользователя по имени
        if (username) {
            api.invalidateCache(`/api/user/get/username/${username}`);
        }
    };

    // Метод для полной очистки кэша пользователей
    const clearUserCache = () => {
        api.invalidateCache('user:');
    };

    return {
        fetchUser,
        getUserById,
        getUsersById,
        getUserByUsername,
        updateUserProfile,
        invalidateUserCache,
        clearUserCache
    };
};
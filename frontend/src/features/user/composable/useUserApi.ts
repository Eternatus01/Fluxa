import { useApiWithCache } from "../../../shared/composables/useApiWithCache";

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
            const { data } = await api.get<{ data: UserData }>('/api/user/me', {}, {
                key: 'user:current',
                ttl: 30 * 60 * 1000
            });
            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const getUserById = async (user_id: string): Promise<UserData> => {
        try {
            const { data } = await api.get<{ data: UserData }>(`/api/user/get/id/${user_id}`, { user_id }, {
                key: `user:id:${user_id}`,
                ttl: 30 * 60 * 1000 // 30 минут
            });

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const getUsersById = async (users_id: string[]): Promise<UserData[]> => {
        try {
            // Для массовых запросов используем уникальный ключ на основе отсортированных ID
            const sortedIds = [...users_id].sort().join(',');

            const { data } = await api.get<{ data: UserData[] }>(`/api/user/get/ids`, { users_id }, {
                key: `users:ids:${sortedIds}`,
                ttl: 30 * 60 * 1000 // 30 минут
            });

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    const getUserByUsername = async (username: string): Promise<UserData> => {
        try {
            const { data } = await api.get<UserData>(`/api/user/get/username/${username}`, { username }, {
                key: `user:username:${username}`,
                ttl: 5 * 60 * 1000
            });

            // Проверяем, что данные существуют и имеют нужную структуру
            if (!data.value) {
                throw new Error(`Не удалось найти пользователя с именем ${username}`);
            }

            // Проверяем, что ответ содержит ID пользователя (минимальная проверка валидности)
            if (!data.value.id) {
                throw new Error(`Получены некорректные данные пользователя ${username}`);
            }

            // Возвращаем данные пользователя
            return data.value;
        } catch (error) {
            throw error;
        }
    };

    // Метод для обновления данных пользователя
    const updateUserProfile = async (userData: Partial<UserData>): Promise<UserData> => {
        try {
            // Создаем массив путей для инвалидации кэша
            const invalidationPaths = ['/api/user/me'];

            if (userData.id) {
                invalidationPaths.push(`/api/user/get/id/${userData.id}`);
            }

            if (userData.username) {
                invalidationPaths.push(`/api/user/get/username/${userData.username}`);
            }

            const { data } = await api.put<{ data: UserData }>('/api/user/update', userData, invalidationPaths);

            if (!data.value || !data.value.data) {
                throw new Error('Не удалось обновить профиль пользователя');
            }

            return data.value;
        } catch (error) {
            throw error;
        }
    };

    // Метод для инвалидации кэша пользователя
    const invalidateUserCache = (userId?: string, username?: string) => {
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
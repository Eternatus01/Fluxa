import { useUserApi } from "../composable/useUserApi";
import { defineStore } from 'pinia';
import { computed, ref } from "vue";
import {
    UserData,
    UpdateUserProfileParams,
    UserId,
    ChannelName,
    ImageUrl,
    UsersCache,
    UsernameToIdMap,
    UserError,
    Username,
    UserState,
} from '../types/userTypes';

export const useUserStore = defineStore("user", () => {
    const userApi = useUserApi();

    // Реактивные состояния
    const user = ref<UserData | null>(null);
    const token = ref<string | null>(null);
    const avatar_url = ref<ImageUrl>('');
    const bunner_url = ref<ImageUrl>('');
    const channel_name = ref<ChannelName>('');
    const user_id = ref<UserId>('');
    const usersCache = ref<UsersCache>({});
    const usernameToIdMap = ref<UsernameToIdMap>({});
    const isLoading = ref<boolean>(false);
    const error = ref<UserError | null>(null);

    // Обновление состояния пользователя
    const updateUserState = (userData: UserData | null) => {
        if (!userData) {
            clearUser();
            return;
        }

        user.value = userData;
        avatar_url.value = userData.avatar_url ?? '';
        bunner_url.value = userData.bunner_url ?? '';
        channel_name.value = userData.channel_name ?? '';
        user_id.value = userData.id ?? '';
    };

    // Получение текущего пользователя
    const fetchUser = async (): Promise<UserData> => {
        isLoading.value = true;
        error.value = null;

        try {
            const userData = await userApi.fetchUser();
            updateUserState(userData);

            // Обновляем кэш
            if (userData.id) {
                usersCache.value[userData.id] = userData;
                if (userData.username) {
                    usernameToIdMap.value[userData.username] = userData.id;
                }
            }

            return userData;
        } catch (err) {
            const userError: UserError = {
                message: err instanceof Error ? err.message : 'Неизвестная ошибка при получении пользователя',
                status: 500
            };
            error.value = userError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Получение пользователя по ID
    const getUserById = async (userId: UserId): Promise<UserData> => {
        // Проверяем кэш
        if (usersCache.value[userId]) {
            return usersCache.value[userId];
        }

        isLoading.value = true;
        error.value = null;

        try {
            const userData = await userApi.getUserById(userId);

            // Обновляем кэш
            usersCache.value[userId] = userData;
            if (userData.username) {
                usernameToIdMap.value[userData.username] = userId;
            }

            return userData;
        } catch (err) {
            const userError: UserError = {
                message: err instanceof Error ? err.message : `Не удалось получить пользователя с ID ${userId}`,
                status: 500
            };
            error.value = userError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Получение нескольких пользователей по ID
    const getUsersById = async (userIds: UserId[]): Promise<UserData[]> => {
        // Фильтруем ID, которые уже есть в кэше
        const cachedUsers: UserData[] = [];
        const uncachedIds: UserId[] = [];

        userIds.forEach(id => {
            if (usersCache.value[id]) {
                cachedUsers.push(usersCache.value[id]);
            } else {
                uncachedIds.push(id);
            }
        });

        // Если все пользователи в кэше, возвращаем их
        if (uncachedIds.length === 0) {
            return cachedUsers;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const fetchedUsers = await userApi.getUsersById(uncachedIds);

            // Обновляем кэш
            fetchedUsers.forEach(user => {
                if (user.id) {
                    usersCache.value[user.id] = user;
                    if (user.username) {
                        usernameToIdMap.value[user.username] = user.id;
                    }
                }
            });

            return [...cachedUsers, ...fetchedUsers];
        } catch (err) {
            const userError: UserError = {
                message: err instanceof Error ? err.message : `Не удалось получить пользователей по ID`,
                status: 500
            };
            error.value = userError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Получение пользователя по имени пользователя
    const getUserByUsername = async (username: Username): Promise<UserData> => {
        // Проверяем, есть ли маппинг username -> id
        if (usernameToIdMap.value[username] && usersCache.value[usernameToIdMap.value[username]]) {
            return usersCache.value[usernameToIdMap.value[username]];
        }

        isLoading.value = true;
        error.value = null;

        try {
            const userData = await userApi.getUserByUsername(username);

            // Обновляем кэш
            if (userData.id) {
                usersCache.value[userData.id] = userData;
                usernameToIdMap.value[username] = userData.id;
            }

            return userData;
        } catch (err) {
            const userError: UserError = {
                message: err instanceof Error ? err.message : `Не удалось получить пользователя с именем ${username}`,
                status: 500
            };
            error.value = userError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Установка пользователя
    const setUser = (userData: UserData) => {
        updateUserState(userData);

        // Обновляем кэш
        if (userData.id) {
            usersCache.value[userData.id] = userData;
            if (userData.username) {
                usernameToIdMap.value[userData.username] = userData.id;
            }
        }
    };

    // Очистка данных пользователя
    const clearUser = () => {
        user.value = null;
        avatar_url.value = '';
        bunner_url.value = '';
        channel_name.value = '';
        user_id.value = '';
    };

    // Очистка кэша
    const clearCache = () => {
        usersCache.value = {};
        usernameToIdMap.value = {};
        userApi.clearUserCache();
    };

    // Обновление профиля пользователя
    const updateUserProfile = async (params: UpdateUserProfileParams): Promise<UserData> => {
        isLoading.value = true;
        error.value = null;

        try {
            const updatedUser = await userApi.updateUserProfile(params);
            updateUserState(updatedUser);

            // Обновляем кэш
            if (updatedUser.id) {
                usersCache.value[updatedUser.id] = updatedUser;
                if (updatedUser.username) {
                    usernameToIdMap.value[updatedUser.username] = updatedUser.id;
                }
            }

            return updatedUser;
        } catch (err) {
            const userError: UserError = {
                message: err instanceof Error ? err.message : 'Не удалось обновить профиль пользователя',
                status: 500
            };
            error.value = userError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Установка аватара
    const setAvatar = (url: string) => {
        avatar_url.value = url;
        if (user.value) {
            user.value.avatar_url = url;

            // Обновляем кэш
            if (user.value.id) {
                usersCache.value[user.value.id] = { ...user.value };
            }
        }
    };

    // Установка баннера
    const setBunner = (url: string) => {
        bunner_url.value = url;
        if (user.value) {
            user.value.bunner_url = url;

            // Обновляем кэш
            if (user.value.id) {
                usersCache.value[user.value.id] = { ...user.value };
            }
        }
    };

    // Установка имени канала
    const setChannelName = (name: ChannelName) => {
        channel_name.value = name;

        if (user.value) {
            user.value.channel_name = name;

            // Обновляем кэш
            if (user.value.id) {
                usersCache.value[user.value.id] = { ...user.value };
            }
        }
    };

    // Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const username = computed<Username>(() => user.value?.username || '');
    const subscribers_count = computed(() => user.value?.subscribers_count || 0);

    // Actions
    const setToken = (newToken: string | null) => {
        token.value = newToken;
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Инициализация из localStorage
    const initFromLocalStorage = () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser);
            } catch (e) {
                console.error('Ошибка при парсинге данных пользователя из localStorage:', e);
                localStorage.removeItem('user');
            }
        }

        if (storedToken) {
            token.value = storedToken;
        }
    };

    // Вызываем инициализацию при создании хранилища
    initFromLocalStorage();

    return {
        user: computed(() => user.value),
        token: computed(() => token.value),
        avatar_url: computed(() => avatar_url.value),
        bunner_url: computed(() => bunner_url.value),
        channel_name: computed(() => channel_name.value),
        user_id: computed(() => user_id.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value),
        usersCache: computed(() => usersCache.value),
        username: computed(() => username.value),
        subscribers_count: computed(() => subscribers_count.value),
        fetchUser,
        getUserById,
        getUsersById,
        getUserByUsername,
        setUser,
        clearUser,
        clearCache,
        updateUserProfile,
        setAvatar,
        setBunner,
        setChannelName,
        isAuthenticated,
        logout,
        setToken
    };
});
import { storageService } from './storageService';

/**
 * Сервис для управления кэшированием данных в приложении
 */
export class CacheService {
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private defaultTTL: number = 5 * 60 * 1000; // 5 минут в миллисекундах
    private storagePrefix: string = 'app_cache:';

    /**
     * Получить данные из кэша
     * @param key - Ключ кэша
     * @param usePersistent - Использовать ли постоянное хранилище
     * @returns Данные из кэша или null, если данные отсутствуют или устарели
     */
    get<T>(key: string, usePersistent: boolean = false): T | null {
        // Сначала проверяем в памяти
        const item = this.cache.get(key);

        if (item) {
            // Проверяем, не устарели ли данные
            const now = Date.now();
            if (item.timestamp < now) {
                // Данные устарели, удаляем их из кэша
                this.cache.delete(key);
            } else {
                return item.data as T;
            }
        }

        // Если данных нет в памяти и разрешено использование постоянного хранилища
        if (usePersistent) {
            const persistentData = storageService.get<T>(`${this.storagePrefix}${key}`);
            if (persistentData) {
                // Если данные есть в постоянном хранилище, добавляем их в память
                this.cache.set(key, {
                    data: persistentData,
                    timestamp: Date.now() + this.defaultTTL
                });
                return persistentData;
            }
        }

        return null;
    }

    /**
     * Сохранить данные в кэш
     * @param key - Ключ кэша
     * @param data - Данные для сохранения
     * @param ttl - Время жизни кэша в миллисекундах (по умолчанию 5 минут)
     * @param persistent - Сохранить ли данные в постоянном хранилище
     */
    set<T>(key: string, data: T, ttl: number = this.defaultTTL, persistent: boolean = false): void {
        const timestamp = Date.now() + ttl;
        this.cache.set(key, { data, timestamp });

        if (persistent) {
            storageService.set(`${this.storagePrefix}${key}`, data, ttl);
        }
    }

    /**
     * Удалить данные из кэша
     * @param key - Ключ кэша
     * @param removePersistent - Удалить ли данные из постоянного хранилища
     */
    remove(key: string, removePersistent: boolean = true): void {
        this.cache.delete(key);

        if (removePersistent) {
            storageService.remove(`${this.storagePrefix}${key}`);
        }
    }

    /**
     * Проверить, содержит ли кеш данные по указанному ключу
     * @param key - Ключ кэша
     * @param checkPersistent - Проверять ли и в постоянном хранилище
     * @returns true если данные есть в кеше и они не устарели
     */
    has(key: string, checkPersistent: boolean = false): boolean {
        // Проверяем в памяти
        const item = this.cache.get(key);
        if (item && item.timestamp > Date.now()) {
            return true;
        }

        // Если разрешено, проверяем в постоянном хранилище
        if (checkPersistent) {
            return storageService.has(`${this.storagePrefix}${key}`);
        }

        return false;
    }

    /**
     * Очистить весь кэш
     * @param clearPersistent - Очистить ли постоянное хранилище
     */
    clear(clearPersistent: boolean = true): void {
        this.cache.clear();

        if (clearPersistent) {
            // Очищаем только записи с нашим префиксом во всех хранилищах
            // Проверяем локальное хранилище
            const keysToRemoveLocal: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    keysToRemoveLocal.push(key);
                }
            }
            keysToRemoveLocal.forEach(key => {
                localStorage.removeItem(key);
                console.log(`Удален из localStorage: ${key}`);
            });

            // Проверяем сессионное хранилище
            const keysToRemoveSession: string[] = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(this.storagePrefix)) {
                    keysToRemoveSession.push(key);
                }
            }
            keysToRemoveSession.forEach(key => {
                sessionStorage.removeItem(key);
                console.log(`Удален из sessionStorage: ${key}`);
            });
        }
    }

    /**
     * Удалить все устаревшие записи из кэша
     */
    cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (item.timestamp < now) {
                this.cache.delete(key);
            }
        }

        // Очищаем устаревшие данные в постоянном хранилище
        storageService.cleanup();
    }
}

// Создаем единственный экземпляр сервиса кэширования
export const cacheService = new CacheService();
import { ref, Ref } from 'vue';
import { cacheService } from '../services/cacheService';

/**
 * Опции кэширования
 */
interface CacheOptions {
  /** Время жизни кэша в миллисекундах */
  ttl?: number;
  /** Использовать ли постоянное хранилище */
  persistent?: boolean;
  /** Принудительно обновить данные, игнорируя кэш */
  forceRefresh?: boolean;
}

/**
 * Хук для работы с кэшем
 * @param keyPrefix - Префикс ключа кэша (обычно название сущности)
 */
export function useCache<T>(keyPrefix: string) {
  /**
   * Получить данные с использованием кэша
   * @param key - Уникальный идентификатор данных
   * @param fetchFn - Функция для получения данных, если их нет в кэше
   * @param options - Опции кэширования
   * @returns Объект с данными, состоянием загрузки и ошибкой
   */
  const fetchWithCache = async <R>(
    key: string,
    fetchFn: () => Promise<R>,
    options: CacheOptions = {}
  ): Promise<{ data: Ref<R | null>; isLoading: Ref<boolean>; error: Ref<Error | null> }> => {
    const data = ref<R | null>(null) as Ref<R | null>;
    const isLoading = ref(true);
    const error = ref<Error | null>(null);
    
    const cacheKey = `${keyPrefix}:${key}`;
    
    try {
      // Если требуется принудительное обновление, не используем кэш
      if (!options.forceRefresh) {
        // Пытаемся получить данные из кэша
        const cachedData = cacheService.get<R>(cacheKey, options.persistent);
        
        if (cachedData) {
          // Если данные есть в кэше, используем их
          data.value = cachedData;
          isLoading.value = false;
          return { data, isLoading, error };
        }
      }
      
      // Если данных нет в кэше или требуется обновление, получаем их
      const freshData = await fetchFn();
      data.value = freshData;
      
      // Сохраняем данные в кэш
      cacheService.set(cacheKey, freshData, options.ttl, options.persistent);
    } catch (err) {
      error.value = err as Error;
      console.error('Ошибка при получении данных:', err);
    } finally {
      isLoading.value = false;
    }
    
    return { data, isLoading, error };
  };

  /**
   * Инвалидировать кэш для указанного ключа
   * @param key - Ключ кэша для инвалидации
   * @param removePersistent - Удалить ли данные из постоянного хранилища
   */
  const invalidateCache = (key: string, removePersistent: boolean = true): void => {
    cacheService.remove(`${keyPrefix}:${key}`, removePersistent);
  };

  /**
   * Обновить данные в кэше
   * @param key - Ключ кэша
   * @param updateFn - Функция для обновления данных
   * @param options - Опции кэширования
   */
  const updateCache = async <R>(
    key: string,
    updateFn: () => Promise<R>,
    options: CacheOptions = {}
  ): Promise<R | null> => {
    const cacheKey = `${keyPrefix}:${key}`;
    try {
      const freshData = await updateFn();
      cacheService.set(cacheKey, freshData, options.ttl, options.persistent);
      return freshData;
    } catch (err) {
      console.error('Ошибка при обновлении данных в кэше:', err);
      return null;
    }
  };

  /**
   * Получить данные из кэша без асинхронной загрузки
   * @param key - Ключ кэша
   * @param usePersistent - Использовать ли постоянное хранилище
   */
  const getFromCache = <R>(key: string, usePersistent: boolean = false): R | null => {
    return cacheService.get<R>(`${keyPrefix}:${key}`, usePersistent);
  };

  /**
   * Сохранить данные в кэш без асинхронной загрузки
   * @param key - Ключ кэша
   * @param data - Данные для сохранения
   * @param options - Опции кэширования
   */
  const setToCache = <R>(key: string, data: R, options: CacheOptions = {}): void => {
    cacheService.set(`${keyPrefix}:${key}`, data, options.ttl, options.persistent);
  };

  return {
    fetchWithCache,
    invalidateCache,
    updateCache,
    getFromCache,
    setToCache
  };
}
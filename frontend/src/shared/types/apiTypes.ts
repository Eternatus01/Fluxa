export interface ApiOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  defaultCacheOptions?: CacheOptions;
}

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  signal?: AbortSignal;
}

export interface CacheOptions {
  enabled?: boolean;
  ttl?: number; // время жизни кэша в миллисекундах
  key?: string; // ключ для кэширования
  persistent?: boolean; // сохранять ли кэш между сессиями
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  cached?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheStorage {
  get<T = any>(key: string): Promise<CacheEntry<T> | null>;
  set<T = any>(key: string, entry: CacheEntry<T>): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  clearByPattern(pattern: string): Promise<void>;
} 
import { UserId } from '../../user/types/userTypes';

// Базовые типы
export type SubscriptionId = string;
export type ChannelId = UserId;
export type SubscriberId = UserId;

// Пользователь канала в контексте подписок
export interface ChannelUser {
  id: ChannelId;
  username: string | null;
  channel_name: string;
  avatar_url: string;
  subscribers_count: number;
}

// Основная структура подписки
export interface Subscription {
  id?: SubscriptionId;
  subscriber_id: SubscriberId;
  channel_id: ChannelId;
  created_at?: string;
  channel?: ChannelUser;
}

// Общий тип ответа API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Типизированные ответы API для подписок
export type SubscriptionResponse = ApiResponse<Subscription>;
export type SubscriptionsResponse = ApiResponse<Subscription[]>;

// Ответ на проверку подписки
export interface SubscriptionCheckResponse {
  isSubscribed: boolean;
}

// Ошибки
export interface SubscriptionError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
}

// Параметры запросов
export interface SubscribeParams {
  subscriber_id: SubscriberId;
  channel_id: ChannelId;
}

export interface UnsubscribeParams {
  subscriber_id: SubscriberId;
  channel_id: ChannelId;
}

export interface CheckSubscriptionParams {
  subscriber_id: SubscriberId;
  channel_id: ChannelId;
}

export interface GetSubscribersParams {
  channel_id: ChannelId;
}

export interface GetSubscriptionsParams {
  subscriber_id: SubscriberId;
}

// Состояние хранилища подписок
export interface SubscriptionState {
  subscriptions: Subscription[] | null;
  isLoading: boolean;
  error: SubscriptionError | null;
} 
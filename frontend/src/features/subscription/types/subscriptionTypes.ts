export interface Subscription {
  id?: string;
  subscriber_id: string;
  channel_id: string;
  created_at?: string;
  channel?: {
    id: string;
    username: string | null;
    channel_name: string;
    avatar_url: string;
    subscribers_count: number;
  };
}

export interface SubscriptionResponse {
  data: Subscription;
  message?: string;
}

export interface SubscriptionsResponse {
  data: Subscription[];
  message?: string;
}

export interface SubscriptionError {
  message: string;
  status?: number;
}

export interface SubscribeParams {
  subscriber_id: string;
  channel_id: string;
}

export interface UnsubscribeParams {
  subscriber_id: string;
  channel_id: string;
}

export interface CheckSubscriptionParams {
  subscriber_id: string;
  channel_id: string;
}

export interface GetSubscribersParams {
  channel_id: string;
}

export interface GetSubscriptionsParams {
  subscriber_id: string;
} 
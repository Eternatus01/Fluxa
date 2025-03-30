export interface Subscription {
  id: string;
  username: string;
  channel_name: string;
  avatar_url: string;
  subscribers_count: number;
}

export interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: Error | null;
}
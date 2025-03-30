export type NotificationType = 'subscription' | 'comment' | 'like' | 'video';

export interface Notification {
  id: string;
  user_id: string;
  sender_id?: string;
  sender?: {
    id: string;
    username: string | null;
    channel_name: string;
    avatar_url: string;
  };
  type: NotificationType;
  content: string;
  read: boolean;
  created_at: string;
  entity_id?: string; // ID связанной сущности (видео, комментария и т.д.)
}

export interface NotificationResponse {
  data: Notification;
  message?: string;
}

export interface NotificationsResponse {
  data: Notification[];
  message?: string;
}

export interface NotificationError {
  message: string;
  status?: number;
}

export interface GetNotificationsParams {
  user_id: string;
  limit?: number;
  offset?: number;
  unread_only?: boolean;
}

export interface MarkAsReadParams {
  notification_id: string;
}

export interface MarkAllAsReadParams {
  user_id: string;
}

export interface CreateNotificationParams {
  user_id: string;
  sender_id?: string;
  type: NotificationType;
  content: string;
  entity_id?: string;
} 
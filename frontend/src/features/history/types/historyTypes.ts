export interface HistoryItem {
  id?: string;
  user_id: string;
  video_id: string;
  watched_at: string;
  video: {
    id: string;
    title: string;
    thumbnail_url: string;
    views: number;
    created_at: string;
    user: {
      id: string;
      channel_name: string;
      avatar_url?: string;
      username?: string;
    }
  };
}

export interface HistoryResponse {
  data: HistoryItem[];
  message?: string;
}

export interface HistoryError {
  message: string;
  status?: number;
}

export interface ClearHistoryResponse {
  success: boolean;
  message: string;
} 
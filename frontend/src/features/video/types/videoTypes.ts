export interface Video {
  id: string;
  videoFile?: File;
  thumbnailFile?: File;
  user_id: string;
  title: string;
  description?: string;
  dislikes_count?: number;
  likes_count?: number;
  views?: number;
  created_at: string;
  thumbnail_url: string;
  video_url: string;
  user?: {
    id: string;
    username: string | null;
    channel_name: string;
    avatar_url: string;
    subscribers_count: number;
  };
  tags?: string[];
  videoType?: string;
  duration?: number;
}

export interface VideoUploadParams {
  title: string;
  description?: string;
  videoFile: File;
  thumbnailFile?: File;
  tags?: string[];
  videoType?: string;
}

export interface VideoResponse {
  data: Video;
  message?: string;
}

export interface VideosResponse {
  data: Video[];
  message?: string;
}

export interface VideoError {
  message: string;
  status?: number;
  field?: string;
} 
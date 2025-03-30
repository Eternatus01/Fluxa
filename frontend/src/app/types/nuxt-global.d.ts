interface User {
  token: string;
  user: UserData;
}

interface UserData {
  id: string;
  username: string | null;
  channel_name: string;
  avatar_url: string;
  bunner_url: string;
  subscribers_count: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

interface ErrorMessage {
  message: string;
  field?: string;
}

interface FilePath {
  file: File;
  filePath: string;
}

interface Video {
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
  user?: UserData;
  tags?: string[];
  videoType?: string;
  duration?: number;
}

interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  text: string;
  parent_id?: string;
  user?: UserData;
  created_at?: string;
  likes_count: number;
  dislikes_count: number;
  replies?: Comment[];
  reply_count?: number;
}

interface Reaction {
  id?: string;
  user_id: string;
  target_id: string;
  entity_type: 'video' | 'comment';
  reaction_type: 'like' | 'dislike';
  created_at?: string;
}

interface ReactionData {
  dislikes_count: number;
  likes_count: number;
}

interface HistoryItem {
  id?: string;
  user_id: string;
  video_id: string;
  viewed_at: string;
  video: Video;
}

interface Subscription {
  id?: string;
  subscriber_id: string;
  channel_id: string;
  created_at?: string;
  channel?: UserData;
}

declare global {
  namespace MyProjectTypes {
    type GlobalUser = User;
    type GlobalUserData = UserData;
    type GlobalFilePath = FilePath;
    type GlobalVideo = Video;
    type GlobalComment = Comment;
    type GlobalReaction = Reaction;
    type GlobalReactionData = ReactionData;
    type GlobalHistoryItem = HistoryItem;
    type GlobalSubscription = Subscription;
  }
}
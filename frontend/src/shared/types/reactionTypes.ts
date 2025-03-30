export type EntityType = 'video' | 'comment';
export type ReactionType = 'like' | 'dislike';

export interface Reaction {
  id?: string;
  user_id: string;
  target_id: string;
  entity_type: EntityType;
  reaction_type: ReactionType;
  created_at?: string;
}

export interface ReactionData {
  dislikes_count: number;
  likes_count: number;
}

export interface ReactionResponse {
  data: ReactionData;
  message?: string;
}

export interface ReactionError {
  message: string;
  status?: number;
}

export interface AddReactionParams {
  user_id: string;
  target_id: string;
  entity_type: EntityType;
  reaction_type: ReactionType;
}

export interface RemoveReactionParams {
  user_id: string;
  target_id: string;
  entity_type: EntityType;
}

export interface GetReactionsParams {
  target_id: string;
  entity_type: EntityType;
}

export interface GetUserReactionParams {
  user_id: string;
  target_id: string;
  entity_type: EntityType;
} 
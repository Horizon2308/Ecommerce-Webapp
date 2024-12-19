export interface Comment {
  id: number;
  username: string;
  content: string;
  likes: number;
  parent_id: number;
  product_id: number;
  isLikedByThisUser: boolean;
  created_at: Date;
}
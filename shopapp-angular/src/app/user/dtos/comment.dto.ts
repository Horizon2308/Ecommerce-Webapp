export class CommentDTO {
  user_id: number;
  content: string;
  likes: number;
  parent_id: number;
  product_id: number;

  constructor(data: any) {
    this.user_id = data.id;
    this.content = data.content;
    this.likes = data.likes;
    this.parent_id = data.parent_id;
    this.product_id = data.product_id;
  }
}

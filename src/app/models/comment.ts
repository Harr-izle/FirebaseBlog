export interface IComment {
    id?: string;
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    updatedAt: Date;
  }
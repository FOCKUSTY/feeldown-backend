import type { Comment, Post } from "@/database/generated/client";

export type CommentWithPost = Comment & {
  post: Post;
};

export type CommentWithParent = Comment & {
  parent: Comment;
};

export type CommentForNotification = CommentWithPost | CommentWithParent;

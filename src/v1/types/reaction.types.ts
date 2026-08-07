import type {
  Comment,
  CommentReaction,
  Post,
  PostReaction,
} from "@/database/generated/browser";

export type PostReactionWithPost = PostReaction & {
  post: Post;
  comment?: null | undefined;
};

export type CommentReactionWithComment = CommentReaction & {
  comment: Comment;
  post?: null | undefined;
};

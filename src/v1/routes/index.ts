import {
  FriendshipCreateDto,
  FriendshipFilterDto,
  FriendshipUpdateDto,
} from "./friendships";
import { PostUpdateDto, PostCreateDto, PostsFilterDto } from "./posts";
import { UserCreateCredentialsDto, UserCreateDto } from "./auth";
import { FollowCreateDto, FollowFilterDto } from "./follow";
import { BlockCreateDto, BlockFilterDto } from "./block";
import { UserUpdateDto } from "./users";

export * from "./auth";
export * from "./users";
export * from "./posts";
export * from "./notifications";
export * from "./friendships";
export * from "./follow";
export * from "./block";

export const DTO = [
  BlockCreateDto,
  BlockFilterDto,
  FollowCreateDto,
  FollowFilterDto,
  FriendshipCreateDto,
  FriendshipFilterDto,
  FriendshipUpdateDto,
  PostCreateDto,
  PostsFilterDto,
  PostUpdateDto,
  UserCreateCredentialsDto,
  UserCreateDto,
  UserUpdateDto,
] as const;

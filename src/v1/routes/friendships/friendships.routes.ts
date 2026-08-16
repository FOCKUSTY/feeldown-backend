import { Routes } from "@/utils";

import { UserEntity, FriendRequestEntity } from "@1/entities";
import { getSchemaPath } from "@nestjs/swagger";
import {
  FriendshipCreateDto,
  FriendshipUpdateDto,
  FriendshipFilterDto,
} from "./dto";

const ID_PARAMETER = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string", format: "uuid" },
  description: "Friend request UUID",
};

const USER_SLUG_PARAMETER = {
  name: "userSlug",
  in: "path" as const,
  required: true,
  schema: { type: "string" },
  description:
    "User identifier: can be a UUID or a username prefixed with '.' (e.g. '.fockusty')",
};

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "friendships",
  routes: {
    GET_ONE: "/:id",
    GET_USER_FRIENDS: "/:userSlug/friends",
    POST: "/",
    PUT: "/:id",
    PATCH: "/:id",
    DELETE: "/:id",
    DELETE_BY_USER: "",
  } as const,
  operations: {
    DELETE: {
      summary: "Delete a request",
    },
    DELETE_BY_USER: {
      summary: "Delete a request by user",
    },
    GET_USER_FRIENDS: {
      summary: "Get friends of a user",
      description:
        "Returns a list of users who are friends with the specified user. " +
        "Supports filtering by status (default: ACCEPTED) and pagination.",
      operationId: "getUserFriends",
      tags: ["Friendships"],
      security: [{ bearerAuth: [] }],
      parameters: [
        USER_SLUG_PARAMETER,
        {
          in: "query",
          type: FriendshipFilterDto,
        },
      ],
      responses: {
        "200": {
          description: "List of friends",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: getSchemaPath(UserEntity) },
              },
            },
          },
        },
        "400": { description: "Invalid query parameters" },
        "401": { description: "Missing or invalid token" },
        "404": { description: "User not found" },
      },
    },
    GET_ONE: {
      summary: "Get a friend request by ID",
      description:
        "Returns a single friend request. Only involved users can access it.",
      operationId: "getFriendRequest",
      tags: ["Friendships"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "Friend request found",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(FriendRequestEntity) },
            },
          },
        },
        "403": { description: "You are not involved in this request" },
        "404": { description: "Friend request not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
    POST: {
      summary: "Send a friend request",
      description:
        "Creates a new friend request from the authenticated user to another user.",
      operationId: "createFriendRequest",
      tags: ["Friendships"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(FriendshipCreateDto) },
          },
        },
      },
      responses: {
        "201": {
          description: "Friend request created",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(FriendRequestEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "401": { description: "Missing or invalid token" },
        "409": { description: "Friend request already exists" },
      },
    },
    PUT: {
      summary: "Update a friend request (full update)",
      description:
        "Updates the status of a friend request (accept/reject). Only involved users can update.",
      operationId: "updateFriendRequest",
      tags: ["Friendships"],
      security: [{ bearerAuth: [] }],
      parameters: [
        ID_PARAMETER,
        {
          in: "query",
          type: FriendshipUpdateDto,
        },
      ],
      responses: {
        "200": {
          description: "Friend request updated",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(FriendRequestEntity) },
            },
          },
        },
        "400": { description: "Invalid status" },
        "403": { description: "You are not involved" },
        "404": { description: "Friend request not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
    PATCH: {
      summary: "Update a friend request (partial update) – alias for PUT",
      description: "Same as PUT, provided for REST compatibility.",
      operationId: "patchFriendRequest",
      tags: ["Friendships"],
      security: [{ bearerAuth: [] }],
      parameters: [
        ID_PARAMETER,
        {
          in: "query",
          type: FriendshipUpdateDto,
        },
      ],
      responses: {
        "200": {
          description: "Friend request updated",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(FriendRequestEntity) },
            },
          },
        },
        "400": { description: "Invalid status" },
        "403": { description: "You are not involved" },
        "404": { description: "Friend request not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
  },
}).execute();

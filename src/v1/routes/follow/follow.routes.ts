import { Routes } from "@/utils";

import { getSchemaPath } from "@nestjs/swagger";
import { UserEntity, FollowEntity } from "@1/entities";
import { FollowCreateDto, FollowFilterDto } from "./dto";

const ID_PARAMETER = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string", format: "uuid" },
  description: "Follow record UUID",
};

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "follow",
  routes: {
    GET: "/",
    GET_ONE: "/:id",
    GET_FOLLOWERS: "/followers",
    GET_FOLLOWING: "/following",
    POST: "/",
    DELETE: "/:id",
  } as const,
  operations: {
    GET: {
      summary: "Get follow records where current user is the follower",
      description:
        "Returns a list of follow records for the authenticated user (where followerId = current user). " +
        "Supports pagination and sorting.",
      operationId: "getFollows",
      tags: ["Follow"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          type: FollowFilterDto,
        },
      ],
      responses: {
        "200": {
          description: "List of follow records",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: getSchemaPath(FollowEntity) },
              },
            },
          },
        },
        "400": { description: "Invalid query parameters" },
        "401": { description: "Missing or invalid token" },
      },
    },
    GET_ONE: {
      summary: "Get a follow record by ID",
      description:
        "Returns a single follow record. Only the involved user can access it.",
      operationId: "getFollow",
      tags: ["Follow"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "Follow record found",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(FollowEntity) },
            },
          },
        },
        "403": { description: "You are not the follower" },
        "404": { description: "Follow record not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
    GET_FOLLOWERS: {
      summary: "Get users who follow the current user",
      description:
        "Returns a list of users who follow the authenticated user. " +
        "Supports pagination and sorting.",
      operationId: "getFollowers",
      tags: ["Follow"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          type: FollowFilterDto,
        },
      ],
      responses: {
        "200": {
          description: "List of followers",
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
      },
    },
    GET_FOLLOWING: {
      summary: "Get users the current user follows",
      description:
        "Returns a list of users that the authenticated user follows. " +
        "Supports pagination and sorting.",
      operationId: "getFollowing",
      tags: ["Follow"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          type: FollowFilterDto,
        },
      ],
      responses: {
        "200": {
          description: "List of followed users",
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
      },
    },
    POST: {
      summary: "Follow a user",
      description:
        "Creates a follow relationship from the authenticated user to another user.",
      operationId: "createFollow",
      tags: ["Follow"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(FollowCreateDto) },
          },
        },
      },
      responses: {
        "201": {
          description: "Follow created",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(FollowEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "401": { description: "Missing or invalid token" },
        "403": { description: "You cannot follow yourself or are blocked" },
        "409": { description: "Already following" },
      },
    },
    DELETE: {
      summary: "Unfollow a user",
      description:
        "Deletes a follow relationship. Only the follower can delete.",
      operationId: "deleteFollow",
      tags: ["Follow"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "Follow deleted",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(FollowEntity) },
            },
          },
        },
        "403": { description: "You are not the follower" },
        "404": { description: "Follow record not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
  },
}).execute();

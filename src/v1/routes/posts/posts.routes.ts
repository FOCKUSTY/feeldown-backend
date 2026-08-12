import type { ApiParameter } from "@/types";

import { PostCreateDto, PostsFilterDto, PostUpdateDto } from "./dto";
import { getSchemaPath } from "@nestjs/swagger";
import { PostEntity } from "@1/entities";
import { Prefix } from "@1/enums";

import { Routes } from "@/utils";

const p = Prefix.postname;

const ID_PARAMETER: ApiParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
  description: "Post UUID",
  example: "123e4567-e89b-12d3-a456-426614174000",
};

const SLUG_PARAMETER: ApiParameter = {
  name: "slug",
  in: "path",
  required: true,
  schema: { type: "string" },
};

const QUERY_PARAMETER: ApiParameter = {
  in: "query",
  type: PostsFilterDto,
};

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "posts",
  routes: {
    GET: "/",
    GET_ONE: "/:slug",
    POST: "/",
    PUT: "/:slug",
    PATCH: "/:slug",
    DELETE: "/:id",
  },
  operations: {
    GET: {
      summary: "Get list of posts",
      description:
        "Returns a paginated list of posts with optional sorting. " +
        "Public endpoint – no authentication required.",
      operationId: "getPosts",
      tags: ["Posts"],
      parameters: [QUERY_PARAMETER],
      responses: {
        "200": {
          description: "List of posts retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: getSchemaPath(PostEntity) },
              },
            },
          },
        },
        "400": { description: "Invalid query parameters" },
      },
    },

    GET_ONE: {
      summary: "Get post by slug",
      description:
        `Retrieves a single post by its slug (prefixed with \`${p}\`) or by UUID. ` +
        `The slug format is \`${p}postname\` (e.g., \`${p}my_awesome_post\`). ` +
        "Public endpoint – no authentication required.",
      operationId: "getPostBySlug",
      tags: ["Posts"],
      parameters: [SLUG_PARAMETER],
      responses: {
        "200": {
          description: "Post found",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(PostEntity) },
            },
          },
        },
        "404": { description: "Post not found" },
      },
    },

    POST: {
      summary: "Create a new post",
      description:
        "Creates a new post for the authenticated user. " +
        "The `postname` is optional – if omitted, it will be auto-generated. " +
        "Requires a valid Bearer token.",
      operationId: "createPost",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(PostCreateDto) },
          },
        },
      },
      responses: {
        "201": {
          description: "Post created successfully",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(PostEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "401": { description: "Missing or invalid token" },
      },
    },

    PUT: {
      summary: "Update post (full update)",
      description:
        "Replaces the entire post data. Only the author can update their own post. " +
        "All fields are optional but will overwrite existing values.",
      operationId: "updatePost",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      parameters: [SLUG_PARAMETER],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(PostUpdateDto) },
          },
        },
      },
      responses: {
        "200": {
          description: "Post updated successfully",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(PostEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "403": { description: "Forbidden – you are not the author" },
        "404": { description: "Post not found" },
        "401": { description: "Missing or invalid token" },
      },
    },

    PATCH: {
      summary: "Update post (partial update)",
      description:
        "Partially updates the post. Only the author can update their own post. " +
        "Only provided fields will be updated.",
      operationId: "patchPost",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      parameters: [SLUG_PARAMETER],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(PostUpdateDto) },
          },
        },
      },
      responses: {
        "200": {
          description: "Post updated successfully",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(PostEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "403": { description: "Forbidden – you are not the author" },
        "404": { description: "Post not found" },
        "401": { description: "Missing or invalid token" },
      },
    },

    DELETE: {
      summary: "Delete post",
      description:
        "Permanently deletes a post. Only the author can delete their own post.",
      operationId: "deletePost",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "Post deleted successfully",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(PostEntity) },
            },
          },
        },
        "403": { description: "Forbidden – you are not the author" },
        "404": { description: "Post not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
  },
}).execute();

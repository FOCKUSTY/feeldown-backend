import type { ApiParameter } from "@/types";

import { getSchemaPath } from "@nestjs/swagger";
import { UserEntity } from "@1/entities";
import { Prefix } from "@1/enums";

import { UserUpdateDto } from "./dto";
import { Routes } from "@/utils";

const p = Prefix.username;

const ID_PARAMETER: ApiParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
};

const SLUG_PARAMETER: ApiParameter = {
  name: "slug",
  in: "path",
  required: true,
  schema: { type: "string" },
};

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "users",
  routes: {
    GET_ONE: "/:slug",
    PUT: "/:slug",
    PATCH: "/:slug",
    DELETE: "/:id",
  },
  operations: {
    GET_ONE: {
      summary: "Get user by slug",
      description:
        `Retrieves a public user profile by username slug (prefixed with \`${p}\`) or by UUID. ` +
        `The slug can be in the format \`${p}username\` (e.g., \`${p}fockusty\`) or a raw UUID. ` +
        `If the slug is \`${p}me\`, returns the current authenticated user (requires token).`,
      operationId: "getUser",
      tags: ["Users"],
      parameters: [SLUG_PARAMETER],
      responses: {
        "200": {
          description: "User found",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(UserEntity) },
            },
          },
        },
        "404": { description: "User not found" },
        "401": {
          description: `Unauthorized (when using ${p}me without token)`,
        },
      },
    },

    PUT: {
      summary: "Update user (full update)",
      description:
        "Replaces the entire user profile. Only the owner can update their own profile. " +
        "All fields are optional but will overwrite existing values.",
      operationId: "updateUser",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [SLUG_PARAMETER],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(UserUpdateDto) },
          },
        },
      },
      responses: {
        "200": {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(UserEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "403": {
          description: "Forbidden – you can only update your own profile",
        },
        "404": { description: "User not found" },
        "401": { description: "Missing or invalid token" },
      },
    },

    PATCH: {
      summary: "Update user (partial update)",
      description:
        "Partially updates the user profile. Only the owner can update their own profile. " +
        "Only provided fields will be updated.",
      operationId: "patchUser",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [SLUG_PARAMETER],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(UserUpdateDto) },
          },
        },
      },
      responses: {
        "200": {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(UserEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "403": {
          description: "Forbidden – you can only update your own profile",
        },
        "404": { description: "User not found" },
        "401": { description: "Missing or invalid token" },
      },
    },

    DELETE: {
      summary: "Delete user",
      description:
        "Permanently deletes the user account and all associated data. " +
        "Only the owner can delete their own account.",
      operationId: "deleteUser",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(UserEntity) },
            },
          },
        },
        "403": {
          description: "Forbidden – you can only delete your own account",
        },
        "404": { description: "User not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
  },
}).execute();

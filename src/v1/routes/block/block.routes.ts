import { Routes } from "@/utils";

import { BlockCreateDto, BlockFilterDto } from "./dto";
import { getSchemaPath } from "@nestjs/swagger";
import { BlockEntity } from "@1/entities";

const ID_PARAMETER = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string", format: "uuid" },
  description: "Block record UUID",
};

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "block",
  routes: {
    GET: "/",
    GET_ONE: "/:id",
    POST: "/",
    DELETE: "/:id",
  } as const,
  operations: {
    GET: {
      summary: "Get block records where current user is the blocker",
      description:
        "Returns a list of blocks for the authenticated user (where blockerId = current user). " +
        "Supports pagination and sorting.",
      operationId: "getBlocks",
      tags: ["Block"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          type: BlockFilterDto,
        },
      ],
      responses: {
        "200": {
          description: "List of block records",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: getSchemaPath(BlockEntity) },
              },
            },
          },
        },
        "400": { description: "Invalid query parameters" },
        "401": { description: "Missing or invalid token" },
      },
    },
    GET_ONE: {
      summary: "Get a block record by ID",
      description:
        "Returns a single block record. Only the blocker can access it.",
      operationId: "getBlock",
      tags: ["Block"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "Block record found",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(BlockEntity) },
            },
          },
        },
        "403": { description: "You are not the blocker" },
        "404": { description: "Block record not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
    POST: {
      summary: "Block a user",
      description:
        "Creates a block relationship from the authenticated user to another user. " +
        "This will also remove any follow or friendship between the users.",
      operationId: "createBlock",
      tags: ["Block"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(BlockCreateDto) },
          },
        },
      },
      responses: {
        "201": {
          description: "Block created",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(BlockEntity) },
            },
          },
        },
        "400": { description: "Validation error" },
        "401": { description: "Missing or invalid token" },
        "403": { description: "You cannot block yourself" },
        "409": { description: "Already blocked" },
      },
    },
    DELETE: {
      summary: "Unblock a user",
      description: "Deletes a block relationship. Only the blocker can delete.",
      operationId: "deleteBlock",
      tags: ["Block"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "Block deleted",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(BlockEntity) },
            },
          },
        },
        "403": { description: "You are not the blocker" },
        "404": { description: "Block record not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
  },
}).execute();

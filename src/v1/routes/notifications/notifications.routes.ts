import { Routes } from "@/utils";

import { NotificationFilterDto, NotificationWhereDto } from "./dto";
import { getSchemaPath } from "@nestjs/swagger";
import { NotificationEntity } from "@1/entities";
import { ACTIONS } from "@1/constants";

const ID_PARAMETER = {
  name: "id",
  in: "path" as const,
  required: true,
  schema: { type: "string", format: "uuid" },
  description: "Notification UUID",
};

const ACTION_QUERY = {
  name: "action",
  in: "query" as const,
  required: true,
  schema: { type: "string", enum: ACTIONS },
  description: "Action to perform: read or unread",
};

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "notifications",
  routes: {
    GET: "/",
    GET_ONE: "/:id",
    GET_COUNT: "/count",
    PUT_MANY: "/",
    PATCH_MANY: "/",
    PUT: "/:id",
    PATCH: "/:id",
  } as const,
  operations: {
    GET: {
      summary: "Get list of notifications for current user",
      description:
        "Returns paginated list of notifications for the authenticated user. " +
        "Supports filtering by actor, type, reference, read status. " +
        "Public endpoint – authentication is optional, but will filter by recipient if user is authenticated.",
      operationId: "getNotifications",
      tags: ["Notifications"],
      parameters: [
        {
          in: "query",
          type: NotificationFilterDto,
        },
      ],
      responses: {
        "200": {
          description: "List of notifications",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: getSchemaPath(NotificationEntity) },
              },
            },
          },
        },
        "400": { description: "Invalid query parameters" },
      },
    },
    GET_ONE: {
      summary: "Get a notification by ID",
      description:
        "Returns a single notification. Only the recipient can access it.",
      operationId: "getNotification",
      tags: ["Notifications"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER],
      responses: {
        "200": {
          description: "Notification found",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(NotificationEntity) },
            },
          },
        },
        "403": { description: "You are not the recipient" },
        "404": { description: "Notification not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
    GET_COUNT: {
      summary: "Get unread notification count",
      description:
        "Returns the number of unread notifications for the current user.",
      operationId: "getUnreadCount",
      tags: ["Notifications"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Unread count",
          content: {
            "application/json": {
              schema: { type: "number", example: 5 },
            },
          },
        },
        "401": { description: "Missing or invalid token" },
      },
    },
    PATCH_MANY: {
      summary: "Update multiple notifications (read/unread)",
      description:
        "Bulk update of notifications matching the filter. Requires action query.",
      operationId: "patchManyNotifications",
      tags: ["Notifications"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          type: NotificationWhereDto,
        },
        ACTION_QUERY,
      ],
      responses: {
        "200": {
          description: "Update result",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { count: { type: "number" } },
              },
            },
          },
        },
        "400": { description: "Invalid query parameters" },
        "401": { description: "Missing or invalid token" },
      },
    },
    PUT_MANY: {
      summary: "Update multiple notifications (read/unread) – alias for PATCH",
      description: "Same as PATCH_MANY, provided for REST compatibility.",
      operationId: "putManyNotifications",
      tags: ["Notifications"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          type: NotificationWhereDto,
        },
        ACTION_QUERY,
      ],
      responses: {
        "200": {
          description: "Update result",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { count: { type: "number" } },
              },
            },
          },
        },
        "400": { description: "Invalid query parameters" },
        "401": { description: "Missing or invalid token" },
      },
    },
    PUT: {
      summary: "Update a single notification (read/unread)",
      description:
        "Mark a notification as read or unread. Requires action query.",
      operationId: "putNotification",
      tags: ["Notifications"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER, ACTION_QUERY],
      responses: {
        "200": {
          description: "Updated notification",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(NotificationEntity) },
            },
          },
        },
        "403": { description: "You are not the recipient" },
        "404": { description: "Notification not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
    PATCH: {
      summary: "Update a single notification (read/unread) – alias for PUT",
      description: "Same as PUT, provided for REST compatibility.",
      operationId: "patchNotification",
      tags: ["Notifications"],
      security: [{ bearerAuth: [] }],
      parameters: [ID_PARAMETER, ACTION_QUERY],
      responses: {
        "200": {
          description: "Updated notification",
          content: {
            "application/json": {
              schema: { $ref: getSchemaPath(NotificationEntity) },
            },
          },
        },
        "403": { description: "You are not the recipient" },
        "404": { description: "Notification not found" },
        "401": { description: "Missing or invalid token" },
      },
    },
  },
}).execute();

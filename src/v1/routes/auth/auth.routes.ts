import { Routes } from "@/utils";
import { AuthEntity, UserEntity } from "@1/entities";
import { getSchemaPath } from "@nestjs/swagger";
import { UserCreateDto } from "./dto";
import { PassportStrategy } from "@1/strategies";
import { Prefix } from "@1/enums";

export const { ROUTE, ROUTES, OPERATIONS } = new Routes({
  route: "auth",
  routes: {
    GET: ["/", "/oauth2"],
    GET_ME: `/${Prefix.username}me`,
    OAUTH2_GET: "/oauth2/:method",
    OAUTH2_GET_CALLBACK: "/oauth2/:method/callback",
    POST: "/",
  },
  operations: {
    GET: {
      summary: "Get available authentication methods",
      description:
        "Returns a list of supported OAuth2 providers (Google, GitHub) and password-based authentication. " +
        "Use these methods to initiate login or registration.",
      operationId: "getAuthMethods",
      tags: ["Auth"],
      responses: {
        "200": {
          description: "List of authentication methods",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  methods: { type: "array", items: { type: "string" } },
                  abbreviations: { type: "array", items: { type: "string" } },
                  stringMethods: { type: "string" },
                  stringAbbreviations: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    GET_ME: {
      summary: "Get current user profile",
      description:
        "Returns the authenticated user's data including auth token details and user information. " +
        "Requires a valid Bearer token.",
      operationId: "getCurrentUser",
      tags: ["Auth"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Current user data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  auth: { $ref: getSchemaPath(AuthEntity) },
                  user: { $ref: getSchemaPath(UserEntity) },
                },
              },
            },
          },
        },
        "401": { description: "Missing or invalid token" },
      },
    },
    OAUTH2_GET: {
      summary: "Initiate OAuth2 flow",
      description:
        "Redirects to the selected OAuth2 provider (Google or GitHub) for user authentication. " +
        "After successful login, the provider will call the callback endpoint.",
      operationId: "oauth2Init",
      tags: ["Auth"],
      parameters: [
        {
          name: "method",
          in: "path",
          required: true,
          schema: {
            type: "string",
            enum: PassportStrategy.methods.methods as string[],
          },
          description: "OAuth2 provider name",
        },
      ],
    },
    OAUTH2_GET_CALLBACK: {
      summary: "OAuth2 callback",
      description:
        "Handles the OAuth2 callback from the provider. Exchanges authorization code for an access token, " +
        "then redirects to the client application with the JWT token as a query parameter.",
      operationId: "oauth2Callback",
      tags: ["Auth"],
      parameters: [
        {
          name: "method",
          in: "path",
          required: true,
          schema: {
            type: "string",
            enum: PassportStrategy.methods.methods as string[],
          },
          description: "OAuth2 provider name",
        },
      ],
    },
    POST: {
      summary: "Register a new user with password",
      description:
        "Creates a new user account using username, password, and optional email/nickname. " +
        "Returns the user object, auth record, and JWT token.",
      operationId: "registerUser",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: getSchemaPath(UserCreateDto) },
          },
        },
      },
      responses: {
        "201": {
          description: "User successfully created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  auth: { $ref: getSchemaPath(AuthEntity) },
                  user: { $ref: getSchemaPath(UserEntity) },
                  token: { type: "string" },
                },
              },
            },
          },
        },
        "400": { description: "Validation failed" },
        "409": { description: "Username already exists" },
      },
    },
  },
}).execute();

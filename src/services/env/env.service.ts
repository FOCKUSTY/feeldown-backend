import { config } from "dotenv";

import {
  getEnvFileName,
  normalizeProgramMode,
  validateTokenExpiration,
} from "./validators";

config({
  path: getEnvFileName(),
});

import type { PassportAuthTypes } from "@1/types";
import { AUTH_PROPERTIES, GROUPED_AUTH_PROPERTIES } from "./env.auth";

import { Env, isInteger } from "fenviee";
import { escapeRegex } from "@/utils/escape-regex.utils";

export const env = Env.create(process.env)({
  required: [
    ...AUTH_PROPERTIES,
    "CLIENT_URL",

    "SESSION_SECRET",
    "HASH_KEY",
    "REDIS_URL",
    "DATABASE_URL",
  ] as const,

  partial: [
    "PRISMA_CONNECTION_TYPE",
    "ENCODING_TYPE",
    "PORT",
    "CACHE_TIME_TO_LIVE_IN_MILLISECONDS",
    "THROTTLER_TIME_TO_LIVE_IN_MILLISECONDS",
    "THROTTLER_LIMIT",
  ] as const,

  default: {
    PRISMA_CONNECTION_TYPE: "adapter",
    ENCODING_TYPE: "hex",
    PORT: "8080",
    CACHE_TIME_TO_LIVE_IN_MILLISECONDS: "300000",
    THROTTLER_TIME_TO_LIVE_IN_MILLISECONDS: "20000",
    THROTTLER_LIMIT: "20",
  },

  unique: {
    AVAILABLE_USERNAME_SYMBOLS: (value?: string) => {
      const string = value ?? "abcdefghijklmnopqrstuvwxyz";
      const safeSymbols = escapeRegex(string).replace(/-/g, "\\-");
      return new RegExp(`^[${safeSymbols}]+$`);
    },
    TOKEN_EXPIRATION: validateTokenExpiration,
    PROGRAM_MODE: normalizeProgramMode,
    SALT_ROUNDS: (value?: string) => {
      if (value === undefined) {
        return 12;
      }

      return isInteger(value);
    },
  },

  dangerousIgnoreErrors: process.env.IGNORE === "true",
});

export const getPassportEnv = (type: Uppercase<PassportAuthTypes>) => {
  const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } =
    GROUPED_AUTH_PROPERTIES[type];

  return {
    id: env[CLIENT_ID],
    secret: env[CLIENT_SECRET],
    callback: env[CALLBACK_URL],
  };
};

export const { PROGRAM_MODE } = env;

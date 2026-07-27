import type OAuth2 from "passport-oauth2";

import type { Profile } from "passport";
import type { VerifyCallback } from "passport-oauth2";

import type { AuthTypes } from "@/database/generated/browser";

export type ExcludedAuthTypes = "telegram";
export type PassportAuthTypes = Exclude<AuthTypes, ExcludedAuthTypes>;

export interface PassportStrategyMixin<TValidationResult = unknown> {
  validate(...args: unknown[]): TValidationResult | Promise<TValidationResult>;
}

export type OAuth2Strategy = OAuth2 & PassportStrategyMixin;
export type Strategies = Map<PassportAuthTypes, OAuth2Strategy>;

export type OAuth2ServiceProperties = {
  path: string;
  scope: string[];
};

export type VerifyFunction = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => void;

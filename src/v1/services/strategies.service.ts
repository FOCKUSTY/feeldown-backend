import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { AuthStrategy } from "../strategies";
import { STRATEGIES_SERVICE_ERRORS } from "../errors";
import { getPassportEnv, LoggerService } from "@/services";
import {
  OAuth2ServiceProperties,
  PassportAuthTypes,
  Strategies,
  VerifyFunction,
} from "@1/types";

const oauth2Services: Record<PassportAuthTypes, OAuth2ServiceProperties> = {
  google: {
    path: "passport-google-oauth20",
    scope: ["openid", "profile", "email"],
  },
  github: {
    path: "passport-github",
    scope: [],
  },
};

@Injectable()
export class StrategiesService {
  public static readonly strategies: Strategies = new Map();

  public static getStrategy(service: string) {
    const strategy = this.strategies.get(service as PassportAuthTypes);
    if (!strategy) {
      throw STRATEGIES_SERVICE_ERRORS.STRATEGY_NOT_FOUND.execute();
    }

    return strategy;
  }

  public constructor(
    private readonly logger: LoggerService,
    private readonly authStrategy: AuthStrategy,
  ) {
    this.execute();
  }

  public execute() {
    for (const oauth2Service in oauth2Services) {
      const service = oauth2Service as PassportAuthTypes;
      this.createStrategy(service, this.verify(service));
    }
  }

  public createStrategy(service: PassportAuthTypes, verify: VerifyFunction) {
    const { path, scope } = oauth2Services[service];
    const client = getPassportEnv(
      service.toUpperCase() as Uppercase<PassportAuthTypes>,
    );
    const { Strategy } = require(path);

    const ServiceStrategyClass = PassportStrategy(Strategy, service);
    const ServiceStrategy = new ServiceStrategyClass(
      {
        clientID: client.id,
        clientSecret: client.secret,
        callbackURL: client.callback,
        scope: scope,
      },
      verify,
    );

    this.logger.execute(`Загружен сервис авторизации ${service}`);
    StrategiesService.strategies.set(service, ServiceStrategy);
    return ServiceStrategy;
  }

  private verify(service: PassportAuthTypes) {
    return async (
      ...[accessToken, refreshToken, profile, done]: Parameters<VerifyFunction>
    ) => {
      try {
        const parameters = {
          accessToken,
          refreshToken,
          profile,
          name: service,
        };

        const signedInData =
          await this.authStrategy.signInByService(parameters);
        if (signedInData) {
          return done(false, signedInData);
        }

        const signedUpData =
          await this.authStrategy.signUpByService(parameters);
        return done(false, signedUpData);
      } catch (error) {
        this.logger.error(error as Error);
        return done(error, false);
      }
    };
  }
}

export default StrategiesService;

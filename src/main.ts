import { env, PROGRAM_MODE } from "@/services";

import { NestFactory } from "@nestjs/core";

import { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { Session } from "./app.session";
import { AppModule } from "./app.module";

import { swagger } from "./swagger";

(async () => {
  if (PROGRAM_MODE === "swagger") {
    return swagger();
  }

  const app = await NestFactory.create(AppModule, {
    cors: { origin: [env.CLIENT_URL], credentials: true },
  });

  new Session(env.SESSION_SECRET, app).create();

  app.use(cookieParser());
  app.use(urlencoded());
  app.use(json());
  app.use(helmet());

  const setupDocumentation = await swagger(app);
  setupDocumentation();

  await app.listen(env.PORT);
})();

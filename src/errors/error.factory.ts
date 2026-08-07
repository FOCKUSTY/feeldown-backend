import { FockerorFactory } from "fockeror";
import { HttpException } from "@nestjs/common";
import { logger } from "@/services";

import { ServerError } from "./server-error";

export const fockerorFactory = new FockerorFactory(HttpException, logger);
export const serverorFactory = new FockerorFactory(ServerError, logger);

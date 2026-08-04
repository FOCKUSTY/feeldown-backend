import type { Pipe } from "@/types";

import { setMetadataInEnchanter, getRequestParameterDecorator } from "@/utils";
import { MePipe, OptionalMePipe } from "@/pipes";
import { Metadata } from "@/enums";

const create = (...pipes: Pipe[]) => {
  return getRequestParameterDecorator(pipes, [
    setMetadataInEnchanter(Metadata.skipAuthGuard, true),
  ]);
};

export const Me = create(MePipe);
export const OptionalMe = create(OptionalMePipe);

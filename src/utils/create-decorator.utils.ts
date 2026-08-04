import type { Pipe } from "@/types";

import type { CustomParamFactory } from "@nestjs/common/interfaces/features/custom-route-param-factory.interface";
import type { ParamDecoratorEnhancer } from "@nestjs/common";
import { createParamDecorator, SetMetadata } from "@nestjs/common";

type DataOrPipes<T> = T extends undefined ? [...Pipe[]] : [T, ...Pipe[]];

export const createParameterDecoratorWithRequiredPipes = <
  FactoryData = undefined,
  FactoryOutput = unknown,
>(
  factory: CustomParamFactory<FactoryData, FactoryOutput>,
  pipes: Pipe[],
  enhancers?: ParamDecoratorEnhancer[],
): ((...dataOrPipes: DataOrPipes<FactoryData>) => ParameterDecorator) => {
  return (data?, ...extraPipes) => {
    const parameters = [...(data ? [data] : []), ...pipes, ...extraPipes];

    return createParamDecorator(factory, enhancers)(...parameters);
  };
};

export const setMetadataInEnchanter = <T>(
  key: string,
  value: T,
): ParameterDecorator => {
  return (target, propertyKey) => {
    const descriptor = Object.getOwnPropertyDescriptor(
      target,
      propertyKey!,
    ) || {
      value: (target as Record<string | symbol, unknown>)[propertyKey!],
      writable: true,
      configurable: true,
    };

    return SetMetadata(key, value)(target, propertyKey!, descriptor);
  };
};

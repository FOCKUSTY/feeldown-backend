import type { CustomParamFactory } from "@nestjs/common/interfaces/features/custom-route-param-factory.interface";
import type { ParamDecoratorEnhancer, Type } from "@nestjs/common";
import {
  createParamDecorator,
  PipeTransform,
  SetMetadata,
} from "@nestjs/common";

type Pipe =
  PipeTransform<unknown, unknown> | Type<PipeTransform<unknown, unknown>>;

export const createParameterDecoratorWithRequiredPipes = <
  FactoryData = unknown,
  FactoryOutput = unknown,
>(
  factory: CustomParamFactory<FactoryData, FactoryOutput>,
  pipes: Pipe[],
  enhancers?: ParamDecoratorEnhancer[],
) => {
  const decorator = (...extraPipes: Pipe[]) => {
    return createParamDecorator(factory, enhancers)(...pipes, ...extraPipes);
  };

  return decorator;
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

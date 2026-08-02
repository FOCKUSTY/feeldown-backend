import type { CustomParamFactory } from "@nestjs/common/interfaces/features/custom-route-param-factory.interface";
import type { ParamDecoratorEnhancer, Type } from "@nestjs/common";
import { createParamDecorator, PipeTransform } from "@nestjs/common";

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

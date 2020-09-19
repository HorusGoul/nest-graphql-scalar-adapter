import { CustomScalar, Scalar, ReturnTypeFunc } from '@nestjs/graphql';
import * as tslib from 'tslib';
import type { Type } from '@nestjs/common';
import type { GraphQLScalarType } from 'graphql';

export interface CreateScalarParams {
  /**
   * `graphql` compatible scalar.
   */
  scalar: GraphQLScalarType;

  /**
   * Custom name for the scalar type, defaults to the provided in the `scalar`.
   */
  name?: string;

  /**
   * Useful if you're using Code First in NestJS
   */
  type?: ReturnTypeFunc;
}

/**
 * This function will create a Nest.js ready Scalar from an existing
 * graphql scalar.
 *
 * For example, if we want to use the `grapqhl-type-json` package we need to do this:
 *
 * ```ts
 *  import JSON from 'graphql-type-json';
 *  import { createFromGraphQLScalar } from 'nest-graphql-scalar-adapter';
 *
 *  export const JSONScalar = createFromGraphQLScalar({ scalar: JSON });
 * ```
 *
 * And then, in your app module you can add it to the list of providers:
 *
 * ```ts
 *  ...
 *
 *  ＠Module({
 *    providers: [
 *      JSONScalar
 *    ]
 *  })
 *  export class MyModule {}
 *
 *  ...
 * ```
 */
export function createFromGraphQLScalar<T = unknown, K = unknown>({
  scalar,
  type,
  name = scalar.name,
}: CreateScalarParams): Type<CustomScalar<T, K>> {
  type ScalarType = CustomScalar<T, K>;

  const className = `${name}AdaptedScalar`;

  /**
   * We're creating a proxy object with the purpose of giving
   * this class a dynamic name based on the input.
   *
   * We need to do this to prevent Nest.js from thinking all scalars
   * are the same (we were using a named class before and we could only register
   * one scalar using this function).
   *
   * Check out the `@Scalar` implementation:
   * https://github.com/nestjs/graphql/blob/e2649df12c937eff9a93b34d7ad6da6673573318/lib/decorators/scalar.decorator.ts#L24-L25
   */
  const proxyObject = {
    [className]: class {
      description = scalar.description ?? undefined;

      parseValue(
        ...params: Parameters<ScalarType['parseValue']>
      ): ReturnType<ScalarType['parseValue']> {
        return scalar.parseValue.bind(scalar)(...params);
      }

      serialize(
        ...params: Parameters<ScalarType['serialize']>
      ): ReturnType<ScalarType['serialize']> {
        return scalar.serialize.bind(scalar)(...params);
      }

      parseLiteral(
        ...params: Parameters<ScalarType['parseLiteral']>
      ): ReturnType<ScalarType['parseLiteral']> {
        return scalar.parseLiteral.bind(scalar)(...params);
      }
    },
  };

  const decorated = tslib.__decorate(
    // @ts-ignore
    [Scalar(name, type)],
    proxyObject[className]
  );

  return decorated;
}

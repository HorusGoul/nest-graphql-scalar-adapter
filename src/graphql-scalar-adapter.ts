import { CustomScalar, Scalar, ReturnTypeFunc } from '@nestjs/graphql';
import type { Type } from '@nestjs/common';
import type { GraphQLScalarType } from 'graphql';

export interface CreateScalarParams {
  /**
   * `graphql` compatible scalar.
   */
  scalar: GraphQLScalarType,

  /**
   * Custom name for the scalar type, defaults to the provided in the `scalar`.
   */
  name?: string,

  /**
   * Useful if you're using Code First in NestJS
   */
  type?: ReturnTypeFunc,
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

  // @ts-ignore
  @Scalar(name, type)
  class GraphQLScalarAdapted {
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
  }

  return GraphQLScalarAdapted;
}

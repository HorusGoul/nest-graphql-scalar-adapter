import 'reflect-metadata';
import { createFromGraphQLScalar } from '../src';
import { Test, TestingModule } from '@nestjs/testing';
import JSONType from 'graphql-type-json';

describe('GraphQL Scalar Adapter', () => {
  it('works', async () => {
    const JSONScalar = createFromGraphQLScalar({ scalar: JSONType });
    const JSONScalar2 = createFromGraphQLScalar({
      scalar: JSONType,
      name: 'JSON2',
    });
    const JSONScalar3 = createFromGraphQLScalar({
      scalar: JSONType,
      name: 'JSON3',
      type: () => Object,
    });

    const app: TestingModule = await Test.createTestingModule({
      providers: [JSONScalar, JSONScalar2, JSONScalar3],
    }).compile();

    const scalar = app.get(JSONScalar);

    expect(scalar).toBeDefined();

    const mockParseValue = jest
      .spyOn(JSONType, 'parseValue')
      .mockImplementation(() => null);

    const mockParseLiteral = jest
      .spyOn(JSONType, 'parseLiteral')
      .mockImplementation(() => null);

    const mockSerialize = jest
      .spyOn(JSONType, 'serialize')
      .mockImplementation(() => null);

    scalar.parseValue(1);

    //@ts-expect-error
    scalar.parseLiteral();

    //@ts-expect-error
    scalar.serialize();

    expect(mockParseValue).toBeCalledTimes(1);
    expect(mockParseLiteral).toBeCalledTimes(1);
    expect(mockSerialize).toBeCalledTimes(1);
  });
});

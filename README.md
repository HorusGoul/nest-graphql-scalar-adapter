# Nest.js GraphQL Scalar Adapter

Makes it easier to import GraphQL scalars in your Nest.js projects.

```
npm i nest-graphql-scalar-adapter

# or

yarn add nest-graphql-scalar-adapter
```

## How to use

We're going to use the `graphql-type-json` package that allows us to add the `JSON` scalar type
in our GraphQL schema.

The only thing we need to do is wrap it with the `createFromGraphQLScalar` function!

```ts
import JSON from 'graphql-type-json';
import { createFromGraphQLScalar } from 'nest-graphql-scalar-adapter';

export const JSONScalar = createFromGraphQLScalar({ scalar: JSON });
//                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

We can also give it a custom name using the `name` option of the `createFromGraphQLScalar` configuration:

```ts
export const JSONScalar = createFromGraphQLScalar({
  scalar: JSON,
  name: 'JSONStatham',
});
```

And also a `type`, which is useful when you're using the **Code First** approach:

```ts
export const JSONScalar = createFromGraphQLScalar({
  scalar: JSON,
  name: 'JSONStatham',

  // The type that you would use with the `@Scalar` decorator.
  type: () => Object,
});
```

**What's the benefit of doing this instead of adding it to the `GraphQLModule` configuration?**

`createFromGraphQLScalar` returns a class that is already decorated with the `@Scalar` decorator. Thanks to this,
we can register our scalars as providers:

```ts
...

@Module({
  providers: [JSONScalar]
})
export class MyModule {}

...
```

By registering them as providers, decoupling external scalars from the `GraphQLModule` configuration becomes easier! 🎉

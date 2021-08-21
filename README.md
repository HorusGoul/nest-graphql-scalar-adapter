<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" height="96" alt="Nest Logo" /></a>
</p>

# nest-graphql-scalar-adapter

<p>
  <a href="https://www.npmjs.com/package/nest-graphql-scalar-adapter" target="\_parent">
    <img src="https://img.shields.io/npm/v/nest-graphql-scalar-adapter.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/nest-graphql-scalar-adapter" target="\_parent">
    <img src="https://img.shields.io/npm/l/nest-graphql-scalar-adapter.svg" alt="Package License" />
  </a>
  <a href="https://github.com/horusgoul/nest-graphql-scalar-adapter/actions?query=CI" target="\_parent">
    <img src="https://github.com/horusgoul/nest-graphql-scalar-adapter/workflows/CI/badge.svg" alt="GitHub Actions" />
  </a>
  <a href="https://coveralls.io/github/HorusGoul/nest-graphql-scalar-adapter?branch=main" target="\_parent">
    <img src="https://coveralls.io/repos/github/HorusGoul/nest-graphql-scalar-adapter/badge.svg?branch=main" alt="Coverage" />
  </a>
  <a href="https://nestjs.com">
    <img alt="Nest.js Version" src="https://img.shields.io/github/package-json/dependency-version/horusgoul/nest-graphql-scalar-adapter/dev/@nestjs/core" />
  </a>
  <a href="https://github.com/horusgoul/nest-graphql-scalar-adapter" target="\_parent">
    <img alt="Star the project" src="https://img.shields.io/github/stars/horusgoul/nest-graphql-scalar-adapter.svg?style=social&label=Star" />
  </a>
  <a href="https://twitter.com/horusgoul" target="\_parent">
    <img alt="Follow me on Twitter" src="https://img.shields.io/twitter/follow/horusgoul.svg?style=social&label=Follow" />
  </a>
  
</p>

## Description

A better way to import external GraphQL scalars into your Nest.js projects.


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

And the scalar is ready! If you're using the **Schema First** remember to add the scalar to your schema like this:

```graphql
scalar JSON
```

<p align="center">
  ~
</p>

**What's the benefit of doing this instead of adding it to the `GraphQLModule` configuration?**

This approach provides you a better way to add external scalars to your project, as it doesn't require you to
define every single scalar in the `resolvers` configuration of the `GraphQLModule`, and instead allows you to
register it as a provider in any module.
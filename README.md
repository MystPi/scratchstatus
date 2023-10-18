# Scratch Status

Dynamic status systems for Scratch and the web.

## Using the pre-made [Scratch status system](/src/scratchstatus/)

This system was made for use in [ocular](https://ocular.jeffalo.net).

```ts
import { scratchstatus } from 'scratchstatus';

const status = `I have {followers} followers.`;

scratchstatus.run(status, 'NFlex23').then(console.log);
```

## Creating a custom status system

```ts
import { createConfig, createSystem } from 'scratchstatus';

const config = createConfig({
  initState: (username) => ({
    username,
    count: 1,
  }),
});

const system = createSystem(config, {
  username: {
    args: [],
    description: 'Returns your username',
    do: (_, { username }) => username,
  },
  join: {
    args: ['a', 'b'],
    description: 'Joins a and b together',
    do: ([a, b]) => `${a}${b}`,
  },
  count: {
    args: [],
    description: 'Count by 1',
    do: (_, state) => {
      return state.count++;
    },
  },
});

const status = `I am {username}. {join "Hello, " "World!"}. Counting 1-3: {count}, {count}, {count}`;

system.run(status, 'MystPi').then(console.log);
```

import { createConfig, createSystem } from '../system';
import { DataFetcher } from './datafetcher';
import { forums, jokes, Forum } from './consts';
import { assertNumber, assertForum, assertCategory } from './asserts';

const config = createConfig({
  initState: (username) => ({
    data: new DataFetcher({
      userdata: `https://scratchdb.lefty.one/v3/user/info/${username}`,
      forumdata: `https://scratchdb.lefty.one/v3/forum/user/info/${username}`,
    }),
    hadJoke: false,
    username,
  }),
});

export const scratchstatus = createSystem(config, {
  // --- Math ---
  add: {
    args: ['a', 'b'],
    description: 'Adds a and b',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return a + b;
    },
  },
  sub: {
    args: ['a', 'b'],
    description: 'Subtracts b from a',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return a - b;
    },
  },
  mul: {
    args: ['a', 'b'],
    description: 'Multiplies a and b',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return a * b;
    },
  },
  div: {
    args: ['a', 'b'],
    description: 'Divides a by b',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return a / b;
    },
  },
  pow: {
    args: ['a', 'b'],
    description: 'Raises a to the power of b',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return Math.pow(a, b);
    },
  },
  root: {
    args: ['a', 'b'],
    description: 'Finds the Nth root of a',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return Math.pow(a, 1 / b);
    },
  },
  percent: {
    args: ['a', 'b'],
    description: 'Finds what percent a is of b',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return (a / b) * 100;
    },
  },
  ordinal: {
    args: ['number'],
    description:
      'Returns the ordinal version of a number. 1st, 32nd, 53rd, etc.',
    do: ([number]) => {
      assertNumber(number);
      const j = number % 10;
      const k = number % 100;
      let suffix = 'th';
      if (j == 1 && k != 11) {
        suffix = 'st';
      }
      if (j == 2 && k != 12) {
        suffix = 'nd';
      }
      if (j == 3 && k != 13) {
        suffix = 'rd';
      }
      return `${number}${suffix}`;
    },
  },
  sep: {
    args: ['number'],
    description: 'Formats a number with commas',
    do: ([number]) => {
      assertNumber(number);
      return number.toLocaleString('en');
    },
  },
  round: {
    args: ['a', 'b'],
    description: 'Rounds a to the given number of decimal places',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return Math.round((a + Number.EPSILON) * 10 ** b) / 10 ** b;
    },
  },
  join: {
    args: null,
    description: 'Joins every argument together',
    do: (args) => args.join(''),
  },
  // --- Logic ---
  eq: {
    args: ['a', 'b'],
    description: 'Checks if a is equal to b',
    do: ([a, b]) => a === b,
  },
  neq: {
    args: ['a', 'b'],
    description: 'Checks if a is not equal to b',
    do: ([a, b]) => a !== b,
  },
  more: {
    args: ['a', 'b'],
    description: 'Checks if a is greater than b',
    do: ([a, b]) => a > b,
  },
  less: {
    args: ['a', 'b'],
    description: 'Checks if a is less than b',
    do: ([a, b]) => a < b,
  },
  not: {
    args: ['x'],
    description: 'Returns the opposite of x, i.e. !x',
    do: ([x]) => !x,
  },
  if: {
    control: true,
    args: ['condition', 'true', 'false'],
    description:
      'If the condition is true, returns the first argument, otherwise returns the second',
    do: async ([condition, trueBranch, falseBranch], ctx) => {
      if (await ctx.evalNode(condition)) {
        return ctx.evalNode(trueBranch);
      } else {
        return ctx.evalNode(falseBranch);
      }
    },
  },
  // --- User Info ---
  username: {
    args: [],
    description: 'Get your username',
    do: (_, { username }) => username,
  },
  id: {
    args: [],
    description: 'Get your ID',
    do: (_, { data }) => data.get('userdata', 0, ['id']),
  },
  country: {
    args: [],
    description: 'Get your country',
    do: (_, { data }) => data.get('userdata', 'error', ['country']),
  },
  status: {
    args: [],
    description: "Your status on Scratch, e.g., 'Scratcher'",
    do: (_, { data }) => data.get('userdata', 'error', ['status']),
  },
  followers: {
    args: [],
    description:
      'Get your followers. A shorter way of saying `{amount followers}`',
    do: (_, { data }) => data.get('userdata', 0, ['statistics', 'followers']),
  },
  amount: {
    args: ['category'],
    description: 'Get your total amount of a category (loves, comments, etc.)',
    do: ([category], { data }) => {
      assertCategory(category);
      return data.get('userdata', 0, ['statistics', category]);
    },
  },
  rank: {
    args: ['category'],
    description: 'Get your rank in a category',
    do: ([category], { data }) => {
      assertCategory(category);
      return data.get('userdata', 0, ['statistics', 'ranks', category]);
    },
  },
  postcount: {
    args: [],
    description: 'Get your post count. A shorter way of saying `{posts total}`',
    do: (_, { data }) => data.get('forumdata', 0, ['counts', 'total', 'count']),
  },
  posts: {
    args: ['forum'],
    description:
      'Get your post count in a forum. Use `total` to get the total number of posts',
    do: ([forum], { data }) => {
      assertForum(forum);
      return data.get('forumdata', 0, [
        'counts',
        forums[forum.toLowerCase() as Forum],
        'count',
      ]);
    },
  },
  forumrank: {
    args: ['forum'],
    description: 'Get your rank in a forum',
    do: ([forum], { data }) => {
      assertForum(forum);
      return data.get('forumdata', 0, [
        'counts',
        forums[forum.toLowerCase() as Forum],
        'rank',
      ]);
    },
  },
  // --- Misc ---
  joke: {
    args: [],
    description: 'Get a random joke (limit of one in your status)',
    do: (_, state) => {
      if (state.hadJoke) {
        throw new Error('Only one joke component is allowed');
      }
      state.hadJoke = true;
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
  },
  random: {
    args: ['a', 'b'],
    description: 'Get a random number between a and b',
    do: ([a, b]) => {
      assertNumber(a);
      assertNumber(b);
      return Math.floor(Math.random() * (b - a + 1)) + a;
    },
  },
  open: {
    args: [],
    description: 'A literal `{`',
    do: () => '{',
  },
  close: {
    args: [],
    description: 'A literal `}`',
    do: () => '}',
  },
});

import moo, { Token } from 'moo';

const ident = {
  match: /[a-zA-Z_]\w*/,
  type: moo.keywords({
    bool: ['true', 'false'],
  }),
};

const string = /"(?:[^"\\]|\\.)*"/;

const number = /-?\d+(?:\.?\d+)?/;

const lbrace = {
  match: '{',
  push: 'component',
};

const rbrace = {
  match: '}',
  pop: 1,
};

const whitespace = {
  match: /\s+/,
  lineBreaks: true,
};

const unquotedString = {
  match: /[^{]+/,
  lineBreaks: true,
};

const error = moo.error;

const lexer = moo.states({
  main: {
    unquotedString,
    lbrace,
    rbrace,
    error,
  },
  component: {
    whitespace,
    ident,
    string,
    number,
    lbrace,
    rbrace,
    error,
  },
});

export function lex(string: string): Token[] {
  lexer.reset(string);
  return Array.from(lexer).filter((t) => t.type !== 'whitespace');
}

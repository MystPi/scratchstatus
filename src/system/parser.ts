import { Token } from 'moo';

/*
  content
    : toplevel*

  toplevel
    : UnquotedString
    | component

  component
    : "{" Ident value* "}"

  value
    : String
    | Number
    | Bool
    | Ident
    | component
*/

export type AstNode = LiteralAstNode | ComponentAstNode;

export type ValueAstNode = LiteralAstNode | ComponentAstNode;

export interface ComponentAstNode {
  type: 'component';
  name: string;
  args: ValueAstNode[];
}

export type LiteralType = string | number | boolean;

export interface LiteralAstNode {
  type: 'value';
  value: LiteralType;
}

export class Parser {
  private readonly tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parseContent(): AstNode[] {
    const contents: AstNode[] = [];

    while (!this.isAtEnd()) {
      contents.push(this.parseToplevel());
    }

    return contents;
  }

  parseToplevel(): AstNode {
    if (this.match('unquotedString')) {
      const token = this.previous();
      return {
        type: 'value',
        value: token.text,
      };
    }

    return this.parseComponent();
  }

  parseComponent(): AstNode {
    this.consume('lbrace');

    const ident = this.consume('ident');

    const values: AstNode[] = [];

    while (!this.match('rbrace')) {
      values.push(this.parseValue());
    }

    return {
      type: 'component',
      name: ident.text,
      args: values,
    };
  }

  parseValue(): AstNode {
    if (this.match('string')) {
      const token = this.previous();
      return {
        type: 'value',
        value: token.text.slice(1, -1),
      };
    }

    if (this.match('number')) {
      const token = this.previous();
      return {
        type: 'value',
        value: +token.text,
      };
    }

    if (this.match('bool')) {
      const token = this.previous();
      return {
        type: 'value',
        value: token.text === 'true',
      };
    }

    if (this.match('ident')) {
      const token = this.previous();
      return {
        type: 'value',
        value: token.text,
      };
    }

    return this.parseComponent();
  }

  match(...types: string[]) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  consume(type: string) {
    if (this.check(type)) return this.advance();
    throw new SyntaxError();
  }

  check(type: string) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.current >= this.tokens.length;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }
}

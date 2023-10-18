import { Parser } from './parser';
import { lex } from './lexer';
import { Components, Evaluator } from './evaluator';

export { Components } from './evaluator';

interface Config<T> {
  initState: (username: string) => T;
  errorHandler?: (err: Error) => string;
}

const defaultErrorHandler = (err: Error) =>
  err instanceof SyntaxError
    ? 'Your status contains syntax errors'
    : err.message;

export const createConfig = <T>(config: Config<T>) => config;

export const createSystem = <T>(
  config: Config<T>,
  components: Components<T>
) => ({
  components,
  run: async (status: string, username: string) => {
    let result: string;

    try {
      const tokens = lex(status);
      const parser = new Parser(tokens);
      const evaluator = new Evaluator(components, config.initState(username));
      const ast = parser.parseContent();

      result = await evaluator.evalNodesToString(ast);
    } catch (e) {
      const handler = config.errorHandler ?? defaultErrorHandler;
      result = '[error] ' + handler(e as Error);
    }

    return result.replace(/\s+/g, ' ');
  },
});

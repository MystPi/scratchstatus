import type { LiteralType } from '../system/parser_ast';
import fetch from 'node-fetch';

export type DataSources = Record<string, string>;

export class DataFetcher<T extends DataSources> {
  private readonly sources: T;
  private readonly cache: Map<keyof T, unknown> = new Map();
  private readonly timeout: number;

  constructor(sources: T, timeout = 5000) {
    this.sources = sources;
    this.timeout = timeout;
  }

  private async fetchWithTimeout(url: string) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res.json();
  }

  async get(
    key: keyof T,
    def: LiteralType,
    path: string[]
  ): Promise<LiteralType> {
    if (this.cache.has(key)) {
      return this.path(this.cache.get(key), def, path);
    } else {
      const source = this.sources[key];

      try {
        const json = await this.fetchWithTimeout(source);
        this.cache.set(key, json);
        return this.path(json, def, path);
      } catch {
        throw new Error('Requested data is not available right now');
      }
    }
  }

  private path(obj: any, def: LiteralType, path: string[]) {
    let result = obj;

    for (const p of path) {
      if (p in result) {
        result = result[p];
      } else {
        result = def;
      }
    }

    return result;
  }
}

import { fetch } from 'undici';

export interface SearchOptions {
  count?: number;
  start?: number;
  format?: 'text';
}

export interface HoogleResult {
  url: string;
  module: {
    url: string;
    name: string;
  };
  package: {
    url: string;
    name: string;
  };
  item: string;
  type: string;
  docs: string;
}

export class HoogleAPI {
  private static baseURL = 'https://hoogle.haskell.org/';

  static async search(
    query: string,
    options?: SearchOptions
  ): Promise<HoogleResult[]> {
    const queryOptions = {
      limit: options?.count ?? 1,
      start: options?.start ?? 1,
    };

    return await fetch(
      `${this.baseURL}?hoogle=${query}&mode=json&start=${1}&count=${
        queryOptions.limit
      }${options?.format ? `&format=${options.format}` : ''}`
    ).then((res) => res.json() as Promise<HoogleResult[]>);
  }
}

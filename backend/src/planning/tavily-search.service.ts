import { Injectable, Logger } from '@nestjs/common';

export type TavilySearchResult = {
  title: string;
  url: string;
  content: string;
};

type TavilyApiResult = {
  title?: string;
  url?: string;
  content?: string;
};

type TavilyApiResponse = {
  results?: TavilyApiResult[];
};

@Injectable()
export class TavilySearchService {
  private readonly logger = new Logger(TavilySearchService.name);
  private readonly apiKey = process.env.TAVILY_API_KEY;

  async search(
    query: string,
    includeDomains?: string[],
    excludeDomains?: string[],
  ): Promise<TavilySearchResult[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          search_depth: 'advanced',
          max_results: 15,
          ...(includeDomains?.length
            ? { include_domains: includeDomains }
            : {}),
          ...(excludeDomains?.length
            ? { exclude_domains: excludeDomains }
            : {}),
        }),
      });

      if (!response.ok) {
        this.logger.warn(`Tavily 검색 실패 (status ${response.status})`);
        return [];
      }

      const data = (await response.json()) as TavilyApiResponse;
      return (data.results ?? [])
        .filter((result) => result.title && result.url)
        .map((result) => ({
          title: result.title!,
          url: result.url!,
          content: result.content ?? '',
        }));
    } catch (error) {
      this.logger.error('Tavily 검색 요청 중 오류가 발생했어요.', error);
      return [];
    }
  }
}

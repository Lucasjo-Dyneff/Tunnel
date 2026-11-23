import type { ExternalApiConfig } from './external-api.config.js';

type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export class ExternalApiError extends Error {
  constructor(
    readonly apiName: string,
    readonly status: number,
    readonly url: string,
    readonly responseBody: string,
  ) {
    super(`[${apiName}] ${status} sur ${url}`);
    this.name = 'ExternalApiError';
  }
}

/**
 * Client HTTP minimal (fetch natif) vers une API externe.
 * URL de base et identifiants viennent exclusivement de la configuration.
 */
export class ExternalApiClient {
  private readonly baseUrl: string;

  constructor(
    readonly name: string,
    private readonly config: ExternalApiConfig,
    private readonly fetchFn: typeof fetch = fetch,
  ) {
    this.baseUrl = config.baseUrl.endsWith('/')
      ? config.baseUrl
      : `${config.baseUrl}/`;
  }

  get<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>('GET', path, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('POST', path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('PUT', path, { ...options, body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>('PATCH', path, { ...options, body });
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>('DELETE', path, options);
  }

  async request<T>(
    method: string,
    path: string,
    { query, headers, body, signal }: RequestOptions = {},
  ): Promise<T> {
    const url = this.buildUrl(path, query);
    const timeout = AbortSignal.timeout(this.config.timeoutMs);

    const response = await this.fetchFn(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...this.authHeaders(),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });

    if (!response.ok) {
      throw new ExternalApiError(
        this.name,
        response.status,
        url.toString(),
        await response.text().catch(() => ''),
      );
    }

    if (response.status === 204) return undefined as T;
    const contentType = response.headers.get('content-type') ?? '';
    return (
      contentType.includes('json') ? response.json() : response.text()
    ) as Promise<T>;
  }

  private buildUrl(path: string, query?: Record<string, QueryValue>): URL {
    const url = new URL(path.replace(/^\/+/, ''), this.baseUrl);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
    return url;
  }

  private authHeaders(): Record<string, string> {
    const { token, apiKey, apiKeyHeader, username, password } = this.config;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    else if (username && password) {
      headers.Authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
    if (apiKey) headers[apiKeyHeader] = apiKey;
    return headers;
  }
}

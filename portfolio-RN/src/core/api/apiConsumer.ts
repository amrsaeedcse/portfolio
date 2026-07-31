/// Abstract interface for API requests.
/// Rule 1 from 01_architecture_network_di.md:
/// Abstract interface for API requests (ApiConsumer).

export interface ApiConsumer {
  get(path: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<any>;
  post(path: string, body?: any, query?: Record<string, any>, headers?: Record<string, string>): Promise<any>;
  put(path: string, body?: any, query?: Record<string, any>, headers?: Record<string, string>): Promise<any>;
  delete(path: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<any>;
}

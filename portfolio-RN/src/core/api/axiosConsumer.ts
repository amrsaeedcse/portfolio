/// Concrete implementation of ApiConsumer using axios.
/// Rule 1 from 01_architecture_network_di.md:
/// The concrete implementation of ApiConsumer using axios (same role as Dio).

import axios, { AxiosInstance } from 'axios';
import { ApiConsumer } from './apiConsumer';
import { EndPoints, ApiKeys } from './endPoints';
import { setupInterceptors } from './apiInterceptors';

class AxiosConsumer implements ApiConsumer {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: EndPoints.baseUrl,
      headers: {
        [ApiKeys.contentType]: ApiKeys.applicationJson,
      },
    });
    setupInterceptors(this.client);
  }

  async get(path: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<any> {
    const response = await this.client.get(path, { params: query, headers });
    return response.data;
  }

  async post(path: string, body?: any, query?: Record<string, any>, headers?: Record<string, string>): Promise<any> {
    const response = await this.client.post(path, body, { params: query, headers });
    return response.data;
  }

  async put(path: string, body?: any, query?: Record<string, any>, headers?: Record<string, string>): Promise<any> {
    const response = await this.client.put(path, body, { params: query, headers });
    return response.data;
  }

  async delete(path: string, query?: Record<string, any>, headers?: Record<string, string>): Promise<any> {
    const response = await this.client.delete(path, { params: query, headers });
    return response.data;
  }
}

// Export singleton instance directly per Rule 4 in 01_architecture_network_di.md
export const apiConsumer: ApiConsumer = new AxiosConsumer();

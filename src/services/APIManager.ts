import { ApiError } from '../types';
import { BASE_URL } from '../utils/constant';

// --- Configuration ---
const API_TIMEOUT_MS = 10000; // 10 seconds

// --- Helper for handling network errors and parsing responses ---
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json(); // Try to parse error message from JSON
    } catch (e) {
      // If it's not JSON, just use status text
      errorData = { message: response.statusText || 'Unknown Error' };
    }
    const error: ApiError = new Error(
      errorData.message || 'API request failed',
    );
    error.statusCode = response.status;
    error.data = errorData;
    throw error;
  }
  return response.json() as Promise<T>; // Assuming JSON response
}

// --- Main APIManager class ---
class APIManager {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  // Common headers for all requests
  private getHeaders(
    contentType: string = 'application/json',
    token: string = '',
  ): any {
    if (token !== '') {
      return {
        'Content-Type': contentType,
        Authorization: `Bearer ${token}`,
      };
    } else {
      return {
        'Content-Type': contentType,
      };
    }
  }

  /**
   * Generic API request method
   * @param endpoint - The API endpoint (e.g., '/users')
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param data - Request body data for POST/PUT
   * @param contentType - Content-Type header
   * @param token - Optional Bearer token
   * @returns A promise that resolves with the parsed JSON data
   */
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: any = null,
    contentType: string = 'application/json',
    token: string = '',
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(contentType, token);

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      if (contentType === 'application/json') {
        config.body = JSON.stringify(data);
      } else if (contentType === 'multipart/form-data') {
        // For file uploads, data should be a FormData object
        config.body = data;
        // Note: Do not set 'Content-Type' for FormData, browser will set it automatically
        delete (config.headers as Record<string, string>)['Content-Type'];
      }
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(id);

      return handleResponse<T>(response);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error(
          `API Request to ${url} timed out after ${API_TIMEOUT_MS}ms`,
        );
        throw new Error(`Request timed out: ${url}`);
      }
      console.error(`API Request failed for ${url} (${method}):`, error);
      throw error;
    }
  }

  // --- Specific API methods ---

  get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, 'GET', null, 'application/json', token);
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'POST', data);
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data);
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE');
  }

  // Example for file upload (multipart/form-data)
  uploadFile<T>(
    endpoint: string,
    fileData: { uri: string; name?: string; type?: string },
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', {
      uri: fileData.uri,
      name: fileData.name || 'upload.jpg',
      type: fileData.type || 'image/jpeg',
    } as any);
    return this.request<T>(endpoint, 'POST', formData, 'multipart/form-data');
  }
}

// Export a singleton instance of APIManager
const apiManager = new APIManager();
export default apiManager;

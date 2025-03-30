import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiClientOptions extends AxiosRequestConfig {
  params?: Record<string, any>;
}

interface ApiClientError {
  message: string;
  status?: number;
  data?: any;
}

// Создаем экземпляр axios с базовым URL
const instance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

// Основная функция apiClient
export const apiClient = async <T = any>(
  url: string,
  options: ApiClientOptions = {}
): Promise<T> => {
  try {
    const { data, params, headers, method = 'GET', ...rest } = options;


    const config: AxiosRequestConfig = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      params,
      data,
      ...rest,
    };

    const response: AxiosResponse<T> = await instance(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const apiError: ApiClientError = {
      message: axiosError.message || 'Произошла ошибка при выполнении запроса',
      status: axiosError.response?.status,
      data: axiosError.response?.data,
    };

    console.error('API Client Error:', apiError);
    throw apiError;
  }
};
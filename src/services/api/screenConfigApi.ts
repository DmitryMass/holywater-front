import type { ApiResponse, ScreenConfig } from '@/types';

import axios from './axios';

// Тип ответа от API
interface ApiResponseData<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Общая функция для обработки ответов API
const handleResponse = <T>(response: { data: ApiResponseData<T> }): ApiResponse<T> => {
  if (response.data.success) {
    return {
      success: true,
      data: response.data.data as T,
      message: response.data.message,
    };
  } else {
    return {
      success: false,
      error: response.data.error || 'Неизвестная ошибка',
    };
  }
};

// Общая функция для обработки ошибок
const handleError = <T>(message: string): ApiResponse<T> => ({
  success: false,
  error: message,
});

// Получение всех конфигураций экранов
export const getScreenConfigs = async (): Promise<ApiResponse<ScreenConfig[]>> => {
  try {
    const response = await axios.get('/screen-configs');
    return {
      success: true,
      data: response.data.data.data, // Backend возвращает данные в формате { data: { data: [] } }
      pagination: response.data.data.pagination,
    };
  } catch {
    return handleError<ScreenConfig[]>('Не удалось получить список конфигураций экранов');
  }
};

// Получение активной конфигурации экрана
export const getActiveScreenConfig = async (): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.get('/screen');
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не удалось получить активную конфигурацию экрана');
  }
};

// Получение конфигурации по ID
export const getScreenConfigById = async (id: string): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.get(`/screen-configs/${id}`);
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не удалось получить конфигурацию экрана');
  }
};

// Создание новой конфигурации экрана
export const createScreenConfig = async (
  data: Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.post('/screen-configs', data);
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не удалось создать конфигурацию экрана');
  }
};

// Обновление существующей конфигурации экрана
export const updateScreenConfig = async (
  id: string,
  data: Partial<Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.put(`/screen-configs/${id}`, data);
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не удалось обновить конфигурацию экрана');
  }
};

// Активация конфигурации экрана
export const activateScreenConfig = async (id: string): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.put(`/screen-configs/${id}/activate`);
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не удалось активировать конфигурацию экрана');
  }
};

// Удаление конфигурации экрана
export const deleteScreenConfig = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axios.delete(`/screen-configs/${id}`);
    return handleResponse<null>(response);
  } catch {
    return handleError<null>('Не удалось удалить конфигурацию экрана');
  }
};

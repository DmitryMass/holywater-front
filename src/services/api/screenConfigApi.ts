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
      error: response.data.error || 'Невідома помилка',
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
    return handleError<ScreenConfig[]>('Не вдалося отримати список конфігурацій екранів');
  }
};

// Получение активной конфигурации экрана
export const getActiveScreenConfig = async (): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.get('/screen');
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не вдалося отримати активну конфігурацію екрану');
  }
};

// Получение конфигурации по ID
export const getScreenConfigById = async (id: string): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.get(`/screen-configs/${id}`);
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не вдалося отримати конфігурацію екрану');
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
    return handleError<ScreenConfig>('Не вдалося створити конфігурацію екрану');
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
    return handleError<ScreenConfig>('Не вдалося оновити конфігурацію екрану');
  }
};

// Активация конфигурации экрана
export const activateScreenConfig = async (id: string): Promise<ApiResponse<ScreenConfig>> => {
  try {
    const response = await axios.put(`/screen-configs/${id}/activate`);
    return handleResponse<ScreenConfig>(response);
  } catch {
    return handleError<ScreenConfig>('Не вдалося активувати конфігурацію екрану');
  }
};

// Удаление конфигурации экрана
export const deleteScreenConfig = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axios.delete(`/screen-configs/${id}`);
    return handleResponse<null>(response);
  } catch {
    return handleError<null>('Не вдалося видалити конфігурацію екрану');
  }
};

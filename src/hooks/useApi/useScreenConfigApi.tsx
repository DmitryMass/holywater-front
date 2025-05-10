import { useState } from 'react';

import * as api from '../../services/api/screenConfigApi';
import type { ScreenConfig } from '../../types';
import {
  useCreateScreenConfig,
  useDeleteScreenConfig,
  useScreenConfig,
  useScreenConfigs,
  useUpdateScreenConfig,
} from './useScreenConfigQueries';

interface UseScreenConfigApiReturn {
  loading: boolean;
  error: string | null;
  configs: ScreenConfig[];
  currentConfig: ScreenConfig | null;
  fetchConfigs: () => Promise<void>;
  fetchConfigById: (id: string) => Promise<ScreenConfig | null>;
  fetchActiveConfig: () => Promise<ScreenConfig | null>;
  createConfig: (
    data: Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>
  ) => Promise<ScreenConfig | null>;
  updateConfig: (
    id: string,
    data: Partial<Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<ScreenConfig | null>;
  deleteConfig: (id: string) => Promise<boolean>;
  activateConfig: (id: string) => Promise<boolean>;
}

/**
 * Хук для работы с API конфигураций экранов.
 * Адаптирует новые хуки TanStack Query к существующему интерфейсу для обратной совместимости.
 */
export const useScreenConfigApi = (): UseScreenConfigApiReturn => {
  const [error, setError] = useState<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState<ScreenConfig | null>(null);

  // Используем новые React Query хуки
  const { data: configs = [], isLoading: isLoadingConfigs } = useScreenConfigs();
  const { refetch: refetchConfigs } = useScreenConfigs();
  const configQuery = useScreenConfig(currentConfig?._id);
  const createConfigMutation = useCreateScreenConfig();
  const updateConfigMutation = useUpdateScreenConfig();
  const deleteConfigMutation = useDeleteScreenConfig();

  // Получение списка конфигураций
  const fetchConfigs = async (): Promise<void> => {
    try {
      setError(null);
      await refetchConfigs();
    } catch (err) {
      setError('Ошибка при загрузке конфигураций');
      console.error(err);
    }
  };

  // Получение конфигурации по ID
  const fetchConfigById = async (id: string): Promise<ScreenConfig | null> => {
    try {
      setError(null);
      // Делаем прямой запрос к API вместо использования refetch,
      // так как может быть случай, когда id еще не установлен в currentConfig
      const response = await api.getScreenConfigById(id);

      if (response.success && response.data) {
        // Преобразуем _id в id для обратной совместимости
        const adaptedConfig = {
          ...response.data,
          id: response.data._id,
        } as unknown as ScreenConfig;

        setCurrentConfig(adaptedConfig);
        return adaptedConfig;
      }
      return null;
    } catch (err) {
      setError('Ошибка при загрузке конфигурации');
      console.error(err);
      return null;
    }
  };

  // Получение активной конфигурации экрана
  const fetchActiveConfig = async (): Promise<ScreenConfig | null> => {
    try {
      setError(null);
      const response = await api.getActiveScreenConfig();

      if (response.success && response.data) {
        // Преобразуем _id в id для обратной совместимости
        const adaptedConfig = {
          ...response.data,
          id: response.data._id,
        } as unknown as ScreenConfig;

        setCurrentConfig(adaptedConfig);
        return adaptedConfig;
      }
      return null;
    } catch (err) {
      setError('Ошибка при загрузке активной конфигурации');
      console.error(err);
      return null;
    }
  };

  // Создание новой конфигурации
  const createConfig = async (
    data: Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<ScreenConfig | null> => {
    try {
      setError(null);
      const newConfig = await createConfigMutation.mutateAsync(data);

      // Преобразуем _id в id для обратной совместимости
      const adaptedConfig = {
        ...newConfig,
        id: newConfig._id,
      } as unknown as ScreenConfig;

      setCurrentConfig(adaptedConfig);
      return adaptedConfig;
    } catch (err) {
      setError('Ошибка при создании конфигурации');
      console.error(err);
      return null;
    }
  };

  // Обновление существующей конфигурации
  const updateConfig = async (
    id: string,
    data: Partial<Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ScreenConfig | null> => {
    try {
      setError(null);
      const updatedConfig = await updateConfigMutation.mutateAsync({ id, data });

      // Преобразуем _id в id для обратной совместимости
      const adaptedConfig = {
        ...updatedConfig,
        id: updatedConfig._id,
      } as unknown as ScreenConfig;

      setCurrentConfig(adaptedConfig);
      return adaptedConfig;
    } catch (err) {
      setError('Ошибка при обновлении конфигурации');
      console.error(err);
      return null;
    }
  };

  // Удаление конфигурации
  const deleteConfig = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await deleteConfigMutation.mutateAsync(id);

      if (currentConfig && currentConfig._id === id) {
        setCurrentConfig(null);
      }

      return true;
    } catch (err) {
      setError('Ошибка при удалении конфигурации');
      console.error(err);
      return false;
    }
  };

  // Активация конфигурации экрана
  const activateConfig = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await api.activateScreenConfig(id);

      if (response.success && response.data) {
        // Обновляем списки после активации
        await fetchConfigs();

        // Если текущая конфигурация - та же, что и активируемая, обновляем её
        if (currentConfig && currentConfig._id === id) {
          const adaptedConfig = {
            ...response.data,
            id: response.data._id,
            isActive: true,
          } as unknown as ScreenConfig;

          setCurrentConfig(adaptedConfig);
        }

        return true;
      }
      return false;
    } catch (err) {
      setError('Ошибка при активации конфигурации');
      console.error(err);
      return false;
    }
  };

  // Адаптируем конфигурации для обратной совместимости (_id -> id)
  const adaptedConfigs = configs.map((config) => ({
    ...config,
    id: config._id,
  })) as unknown as ScreenConfig[];

  return {
    loading:
      isLoadingConfigs ||
      configQuery.isLoading ||
      createConfigMutation.isPending ||
      updateConfigMutation.isPending ||
      deleteConfigMutation.isPending,
    error,
    configs: adaptedConfigs,
    currentConfig,
    fetchConfigs,
    fetchConfigById,
    fetchActiveConfig,
    createConfig,
    updateConfig,
    deleteConfig,
    activateConfig,
  };
};

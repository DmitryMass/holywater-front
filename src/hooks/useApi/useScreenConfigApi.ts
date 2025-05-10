import type { ScreenConfig } from '@/types';

import { useState } from 'react';

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
  createConfig: (
    data: Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>
  ) => Promise<ScreenConfig | null>;
  updateConfig: (
    id: string,
    data: Partial<Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<ScreenConfig | null>;
  deleteConfig: (id: string) => Promise<boolean>;
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

  const { isLoading: isLoadingConfig, refetch: refetchConfig } = useScreenConfig(
    currentConfig?._id
  );

  const createConfigMutation = useCreateScreenConfig();
  const updateConfigMutation = useUpdateScreenConfig();
  const deleteConfigMutation = useDeleteScreenConfig();

  // Общий статус загрузки
  const loading =
    isLoadingConfigs ||
    isLoadingConfig ||
    createConfigMutation.isPending ||
    updateConfigMutation.isPending ||
    deleteConfigMutation.isPending;

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
      setCurrentConfig((prev) => (prev?._id === id ? prev : null));

      // Устанавливаем ID для загрузки данных
      const { data } = await refetchConfig();

      if (data) {
        // Преобразуем _id в id для обратной совместимости
        const adaptedConfig = {
          ...data,
          id: data._id,
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

  // Создание новой конфигурации
  const createConfig = async (
    data: Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<ScreenConfig | null> => {
    try {
      setError(null);
      const newConfig = await createConfigMutation.mutateAsync(data);

      // Добавляем id для обратной совместимости
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

      // Добавляем id для обратной совместимости
      const adaptedConfig = {
        ...updatedConfig,
        id: updatedConfig._id,
      } as unknown as ScreenConfig;

      if (currentConfig && currentConfig._id === id) {
        setCurrentConfig(adaptedConfig);
      }

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

  return {
    loading,
    error,
    configs,
    currentConfig,
    fetchConfigs,
    fetchConfigById,
    createConfig,
    updateConfig,
    deleteConfig,
  };
};

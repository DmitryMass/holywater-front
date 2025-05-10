import * as api from '@/services/api/screenConfigApi';
import type { ScreenConfig } from '@/types';
import { toast } from 'sonner';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Ключи для запросов
export const queryKeys = {
  allScreenConfigs: ['screenConfigs'] as const,
  screenConfig: (id?: string) => ['screenConfig', id] as const,
  activeScreenConfig: ['activeScreenConfig'] as const,
};

// Получение списка всех конфигураций
export const useScreenConfigs = () => {
  return useQuery({
    queryKey: queryKeys.allScreenConfigs,
    queryFn: async () => {
      const response = await api.getScreenConfigs();
      if (!response.success) {
        throw new Error(response.error || 'Не вдалося отримати конфігурації екранів');
      }
      return response.data || [];
    },
  });
};

// Получение конфигурации по ID
export const useScreenConfig = (id?: string) => {
  return useQuery({
    queryKey: queryKeys.screenConfig(id),
    queryFn: async () => {
      if (!id) return null;
      const response = await api.getScreenConfigById(id);
      if (!response.success) {
        throw new Error(response.error || 'Не вдалося отримати конфігурацію екрану');
      }
      return response.data || null;
    },
    enabled: !!id, // Выполнять запрос только если есть ID
  });
};

// Получение активной конфигурации
export const useActiveScreenConfig = () => {
  return useQuery({
    queryKey: queryKeys.activeScreenConfig,
    queryFn: async () => {
      const response = await api.getActiveScreenConfig();
      if (!response.success) {
        throw new Error(response.error || 'Не вдалося отримати активну конфігурацію екрану');
      }
      return response.data || null;
    },
  });
};

// Создание новой конфигурации
export const useCreateScreenConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>) => {
      const response = await api.createScreenConfig(data);
      if (!response.success) {
        throw new Error(response.error || 'Не вдалося створити конфігурацію екрану');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Инвалидируем все запросы, чтобы обновить данные с сервера
      queryClient.invalidateQueries({ queryKey: queryKeys.allScreenConfigs });
      queryClient.invalidateQueries({ queryKey: queryKeys.screenConfig(data._id) });
      if (data.isActive) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeScreenConfig });
      }
    },
    onError: (error: Error) => {
      toast.error(`Помилка при створенні конфігурації: ${error.message}`);
    },
  });
};

// Обновление существующей конфигурации
export const useUpdateScreenConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<ScreenConfig, '_id' | 'createdAt' | 'updatedAt'>>;
    }) => {
      const response = await api.updateScreenConfig(id, data);
      if (!response.success) {
        throw new Error(response.error || 'Не вдалося оновити конфігурацію екрану');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Инвалидируем все запросы, чтобы обновить данные с сервера
      queryClient.invalidateQueries({ queryKey: queryKeys.allScreenConfigs });
      queryClient.invalidateQueries({ queryKey: queryKeys.screenConfig(data._id) });
      if (data.isActive) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeScreenConfig });
      }
    },
    onError: (error: Error) => {
      toast.error(`Помилка при оновленні конфігурації: ${error.message}`);
    },
  });
};

// Активация конфигурации
export const useActivateScreenConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.activateScreenConfig(id);
      if (!response.success) {
        throw new Error(response.error || 'Не вдалося активувати конфігурацію екрану');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Инвалидируем список всех конфигураций, так как изменился статус активности
      queryClient.invalidateQueries({ queryKey: queryKeys.allScreenConfigs });
      // Инвалидируем данные конкретной конфигурации
      queryClient.invalidateQueries({ queryKey: queryKeys.screenConfig(data._id) });
      // Инвалидируем активную конфигурацию
      queryClient.invalidateQueries({ queryKey: queryKeys.activeScreenConfig });
    },
    onError: (error: Error) => {
      toast.error(`Помилка при активації конфігурації: ${error.message}`);
    },
  });
};

// Удаление конфигурации
export const useDeleteScreenConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.deleteScreenConfig(id);
      if (!response.success) {
        throw new Error(response.error || 'Не вдалося видалити конфігурацію екрану');
      }
      return id;
    },
    onSuccess: (id) => {
      // Инвалидируем список всех конфигураций
      queryClient.invalidateQueries({ queryKey: queryKeys.allScreenConfigs });
      // Удаляем данные конкретной конфигурации из кэша
      queryClient.removeQueries({ queryKey: queryKeys.screenConfig(id) });
      // Инвалидируем активную конфигурацию (на случай, если удалили активную)
      queryClient.invalidateQueries({ queryKey: queryKeys.activeScreenConfig });
    },
    onError: (error: Error) => {
      toast.error(`Помилка при видаленні конфігурації: ${error.message}`);
    },
  });
};

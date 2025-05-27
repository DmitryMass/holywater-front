import { act, renderHook, waitFor } from '@testing-library/react';

import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useScreenConfigApi } from '../useApi/useScreenConfigApi';

// Мокаем зависимости
jest.mock('../useApi/useScreenConfigQueries', () => ({
  useScreenConfigs: jest.fn(),
  useScreenConfig: jest.fn(),
  useCreateScreenConfig: jest.fn(),
  useUpdateScreenConfig: jest.fn(),
  useDeleteScreenConfig: jest.fn(),
}));

const mockUseScreenConfigs = require('../useApi/useScreenConfigQueries').useScreenConfigs;
const mockUseScreenConfig = require('../useApi/useScreenConfigQueries').useScreenConfig;
const mockUseCreateScreenConfig = require('../useApi/useScreenConfigQueries').useCreateScreenConfig;
const mockUseUpdateScreenConfig = require('../useApi/useScreenConfigQueries').useUpdateScreenConfig;
const mockUseDeleteScreenConfig = require('../useApi/useScreenConfigQueries').useDeleteScreenConfig;

// Создаем wrapper для React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => {
    return QueryClientProvider({ client: queryClient, children });
  };
};

describe('useScreenConfigApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Настройка базовых моков
    mockUseScreenConfigs.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: jest.fn().mockResolvedValue({ data: [] }),
    });

    mockUseScreenConfig.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: jest.fn().mockResolvedValue({ data: null }),
    });

    mockUseCreateScreenConfig.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    mockUseUpdateScreenConfig.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });

    mockUseDeleteScreenConfig.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  it('должен возвращать начальное состояние', () => {
    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.configs).toEqual([]);
    expect(result.current.currentConfig).toBe(null);
    expect(typeof result.current.fetchConfigs).toBe('function');
    expect(typeof result.current.fetchConfigById).toBe('function');
    expect(typeof result.current.createConfig).toBe('function');
    expect(typeof result.current.updateConfig).toBe('function');
    expect(typeof result.current.deleteConfig).toBe('function');
  });

  it('должен показывать состояние загрузки', () => {
    mockUseScreenConfigs.mockReturnValue({
      data: [],
      isLoading: true,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
  });

  it('должен возвращать конфигурации', () => {
    const mockConfigs = [
      { _id: '1', name: 'Config 1', sections: [] },
      { _id: '2', name: 'Config 2', sections: [] },
    ];

    mockUseScreenConfigs.mockReturnValue({
      data: mockConfigs,
      isLoading: false,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    expect(result.current.configs).toEqual(mockConfigs);
  });

  it('должен обрабатывать fetchConfigs', async () => {
    const mockRefetch = jest.fn().mockResolvedValue({ data: [] });

    mockUseScreenConfigs.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.fetchConfigs();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('должен обрабатывать создание конфигурации', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({
      _id: 'new-id',
      name: 'New Config',
      sections: [],
    });

    mockUseCreateScreenConfig.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    const newConfigData = {
      name: 'New Config',
      sections: [],
      isActive: false,
      version: 1,
    };

    let createdConfig;
    await act(async () => {
      createdConfig = await result.current.createConfig(newConfigData);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(newConfigData);
    expect(createdConfig).toEqual({
      _id: 'new-id',
      name: 'New Config',
      sections: [],
      id: 'new-id',
    });
  });

  it('должен обрабатывать обновление конфигурации', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({
      _id: 'updated-id',
      name: 'Updated Config',
      sections: [],
    });

    mockUseUpdateScreenConfig.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    const updateData = { name: 'Updated Config' };
    let updatedConfig;
    await act(async () => {
      updatedConfig = await result.current.updateConfig('updated-id', updateData);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: 'updated-id',
      data: updateData,
    });
    expect(updatedConfig).toEqual({
      _id: 'updated-id',
      name: 'Updated Config',
      sections: [],
      id: 'updated-id',
    });
  });

  it('должен обрабатывать удаление конфигурации', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(undefined);

    mockUseDeleteScreenConfig.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    let success;
    await act(async () => {
      success = await result.current.deleteConfig('delete-id');
    });

    expect(mockMutateAsync).toHaveBeenCalledWith('delete-id');
    expect(success).toBe(true);
  });

  it('должен обрабатывать ошибки при создании', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error('Network error'));

    mockUseCreateScreenConfig.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    const newConfigData = {
      name: 'New Config',
      sections: [],
      isActive: false,
      version: 1,
    };

    let createdConfig;
    await act(async () => {
      createdConfig = await result.current.createConfig(newConfigData);
    });

    expect(createdConfig).toBe(null);

    await waitFor(() => {
      expect(result.current.error).toBe('Помилка при створенні конфігурації');
    });
  });

  it('должен обрабатывать ошибки при обновлении', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error('Network error'));

    mockUseUpdateScreenConfig.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    const updateData = { name: 'Updated Config' };
    let updatedConfig;
    await act(async () => {
      updatedConfig = await result.current.updateConfig('updated-id', updateData);
    });

    expect(updatedConfig).toBe(null);

    await waitFor(() => {
      expect(result.current.error).toBe('Помилка при оновленні конфігурації');
    });
  });

  it('должен обрабатывать ошибки при удалении', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error('Network error'));

    mockUseDeleteScreenConfig.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const { result } = renderHook(() => useScreenConfigApi(), {
      wrapper: createWrapper(),
    });

    let success;
    await act(async () => {
      success = await result.current.deleteConfig('delete-id');
    });

    expect(success).toBe(false);

    await waitFor(() => {
      expect(result.current.error).toBe('Помилка при видаленні конфігурації');
    });
  });
});

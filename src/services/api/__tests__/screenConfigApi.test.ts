import type { ScreenConfig } from '@/types';

import axios from '../axios';
import {
  activateScreenConfig,
  createScreenConfig,
  deleteScreenConfig,
  getActiveScreenConfig,
  getScreenConfigById,
  getScreenConfigs,
  updateScreenConfig,
} from '../screenConfigApi';

// Мокируем axios модуль
jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Мок данные
const mockScreenConfig: ScreenConfig = {
  _id: 'config-1',
  id: 'config-1',
  name: 'Test Config',
  sections: [
    {
      id: 'section-1',
      type: 'banner',
      title: 'Test Section',
      items: [
        {
          id: 'item-1',
          type: 'text',
          content: {
            title: 'Test Item',
          },
        },
      ],
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  isActive: true,
  version: 1,
};

const mockApiResponse = {
  data: {
    success: true,
    data: mockScreenConfig,
    message: 'Success',
  },
};

const mockApiListResponse = {
  data: {
    data: {
      data: [mockScreenConfig],
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
      },
    },
  },
};

describe('screenConfigApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getScreenConfigs', () => {
    it('should return list of screen configs on success', async () => {
      mockedAxios.get.mockResolvedValue(mockApiListResponse);

      const result = await getScreenConfigs();

      expect(mockedAxios.get).toHaveBeenCalledWith('/screen-configs');
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockScreenConfig]);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
      });
    });

    it('should return error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await getScreenConfigs();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Не вдалося отримати список конфігурацій екранів');
    });
  });

  describe('getActiveScreenConfig', () => {
    it('should return active screen config on success', async () => {
      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getActiveScreenConfig();

      expect(mockedAxios.get).toHaveBeenCalledWith('/screen');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockScreenConfig);
    });

    it('should return error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await getActiveScreenConfig();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Не вдалося отримати активну конфігурацію екрану');
    });
  });

  describe('getScreenConfigById', () => {
    it('should return screen config by ID on success', async () => {
      mockedAxios.get.mockResolvedValue(mockApiResponse);

      const result = await getScreenConfigById('config-1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/screen-configs/config-1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockScreenConfig);
    });

    it('should return error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await getScreenConfigById('config-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Не вдалося отримати конфігурацію екрану');
    });
  });

  describe('createScreenConfig', () => {
    it('should create new screen config on success', async () => {
      const createData = {
        name: 'New Config',
        sections: [],
        isActive: false,
        version: 1,
      };

      mockedAxios.post.mockResolvedValue(mockApiResponse);

      const result = await createScreenConfig(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/screen-configs', createData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockScreenConfig);
    });

    it('should return error on API failure', async () => {
      const createData = {
        name: 'New Config',
        sections: [],
        isActive: false,
        version: 1,
      };

      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const result = await createScreenConfig(createData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Не вдалося створити конфігурацію екрану');
    });
  });

  describe('updateScreenConfig', () => {
    it('should update screen config on success', async () => {
      const updateData = {
        name: 'Updated Config',
      };

      mockedAxios.put.mockResolvedValue(mockApiResponse);

      const result = await updateScreenConfig('config-1', updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith('/screen-configs/config-1', updateData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockScreenConfig);
    });

    it('should return error on API failure', async () => {
      const updateData = {
        name: 'Updated Config',
      };

      mockedAxios.put.mockRejectedValue(new Error('Network error'));

      const result = await updateScreenConfig('config-1', updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Не вдалося оновити конфігурацію екрану');
    });
  });

  describe('activateScreenConfig', () => {
    it('should activate screen config on success', async () => {
      mockedAxios.put.mockResolvedValue(mockApiResponse);

      const result = await activateScreenConfig('config-1');

      expect(mockedAxios.put).toHaveBeenCalledWith('/screen-configs/config-1/activate');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockScreenConfig);
    });

    it('should return error on API failure', async () => {
      mockedAxios.put.mockRejectedValue(new Error('Network error'));

      const result = await activateScreenConfig('config-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Не вдалося активувати конфігурацію екрану');
    });
  });

  describe('deleteScreenConfig', () => {
    it('should delete screen config on success', async () => {
      const deleteResponse = {
        data: {
          success: true,
          data: null,
          message: 'Deleted successfully',
        },
      };

      mockedAxios.delete.mockResolvedValue(deleteResponse);

      const result = await deleteScreenConfig('config-1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/screen-configs/config-1');
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it('should return error on API failure', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Network error'));

      const result = await deleteScreenConfig('config-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Не вдалося видалити конфігурацію екрану');
    });
  });

  describe('API response handling', () => {
    it('should handle API error response', async () => {
      const errorResponse = {
        data: {
          success: false,
          error: 'Custom API error',
        },
      };

      mockedAxios.get.mockResolvedValue(errorResponse);

      const result = await getActiveScreenConfig();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Custom API error');
    });

    it('should handle API response without error message', async () => {
      const errorResponse = {
        data: {
          success: false,
        },
      };

      mockedAxios.get.mockResolvedValue(errorResponse);

      const result = await getActiveScreenConfig();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Невідома помилка');
    });
  });
});

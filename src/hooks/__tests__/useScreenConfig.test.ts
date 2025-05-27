/**
 * @jest-environment jsdom
 */
import { useScreenConfig } from '@/hooks/useScreenConfig/useScreenConfig';
import type { ScreenConfig } from '@/types';
import { act, renderHook } from '@testing-library/react';

// Мок данные для тестирования
const mockScreenConfig: ScreenConfig = {
  _id: 'test-config-1',
  id: 'test-config-1',
  name: 'Test Screen Config',
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
            subtitle: 'Test Subtitle',
          },
        },
      ],
      settings: {
        backgroundColor: '#ffffff',
        padding: '16px',
      },
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  isActive: true,
  version: 1,
};

describe('useScreenConfig', () => {
  it('should initialize with empty config', () => {
    const { result } = renderHook(() => useScreenConfig());

    expect(result.current.config).toBeNull();
  });

  it('should set screen config', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    expect(result.current.config).toEqual(mockScreenConfig);
  });

  it('should generate JSON representation', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    const json = result.current.getJsonRepresentation();

    // Проверяем, что JSON валидный
    expect(() => JSON.parse(json)).not.toThrow();

    // Проверяем содержимое JSON
    const parsedJson = JSON.parse(json);
    expect(parsedJson).toHaveProperty('_id');
    expect(parsedJson).toHaveProperty('name');
    expect(parsedJson).toHaveProperty('sections');
    expect(parsedJson.name).toBe('Test Screen Config');
    expect(parsedJson.sections).toHaveLength(1);
  });

  it('should return empty object JSON when no config', () => {
    const { result } = renderHook(() => useScreenConfig());

    const json = result.current.getJsonRepresentation();

    expect(json).toBe('{}');
  });

  it('should add section', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    act(() => {
      result.current.addSection('grid', 'New Section');
    });

    expect(result.current.config?.sections).toHaveLength(2);
    expect(result.current.config?.sections[1].type).toBe('grid');
    expect(result.current.config?.sections[1].title).toBe('New Section');
  });

  it('should update section', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    act(() => {
      result.current.updateSection('section-1', {
        title: 'Updated Section Title',
      });
    });

    expect(result.current.config?.sections[0].title).toBe('Updated Section Title');
  });

  it('should remove section', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    act(() => {
      result.current.deleteSection('section-1');
    });

    expect(result.current.config?.sections).toHaveLength(0);
  });

  it('should preserve JSON structure after operations', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    // Добавляем секцию
    act(() => {
      result.current.addSection('hero', 'Hero Section');
    });

    const json = result.current.getJsonRepresentation();
    const parsedJson = JSON.parse(json);

    expect(parsedJson.sections).toHaveLength(2);
    expect(parsedJson.sections[1].type).toBe('hero');
    expect(parsedJson.sections[1].title).toBe('Hero Section');
  });

  it('should add item to section', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    act(() => {
      result.current.addItem('section-1', 'button', {
        title: 'Test Button',
        actionUrl: 'https://example.com',
      });
    });

    expect(result.current.config?.sections[0].items).toHaveLength(2);
    expect(result.current.config?.sections[0].items[1].type).toBe('button');
    expect(result.current.config?.sections[0].items[1].content.title).toBe('Test Button');
  });

  it('should update item in section', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    act(() => {
      result.current.updateItem('section-1', 'item-1', {
        content: {
          title: 'Updated Item Title',
          subtitle: 'Updated Subtitle',
        },
      });
    });

    expect(result.current.config?.sections[0].items[0].content.title).toBe('Updated Item Title');
    expect(result.current.config?.sections[0].items[0].content.subtitle).toBe('Updated Subtitle');
  });

  it('should delete item from section', () => {
    const { result } = renderHook(() => useScreenConfig());

    act(() => {
      result.current.setConfig(mockScreenConfig);
    });

    act(() => {
      result.current.deleteItem('section-1', 'item-1');
    });

    expect(result.current.config?.sections[0].items).toHaveLength(0);
  });
});

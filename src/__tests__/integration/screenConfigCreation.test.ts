/**
 * @jest-environment jsdom
 */
import { useScreenConfig } from '@/hooks/useScreenConfig/useScreenConfig';
import type { ScreenConfig } from '@/types';
import { act, renderHook } from '@testing-library/react';

describe('Screen Config Creation Integration', () => {
  it('should create complete screen config from scratch', () => {
    const { result } = renderHook(() => useScreenConfig());

    // Создаем базовую конфигурацию
    const baseConfig: ScreenConfig = {
      _id: 'integration-test-1',
      id: 'integration-test-1',
      name: 'Integration Test Config',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
      version: 1,
    };

    act(() => {
      result.current.setConfig(baseConfig);
    });

    // Добавляем секцию banner
    act(() => {
      result.current.addSection('banner', 'Hero Banner');
    });

    // Добавляем элементы в banner секцию
    const bannerSectionId = result.current.config?.sections[0].id;
    expect(bannerSectionId).toBeDefined();

    act(() => {
      result.current.addItem(bannerSectionId!, 'image', {
        title: 'Hero Image',
        imageUrl: 'https://example.com/hero.jpg',
        actionUrl: 'https://example.com',
      });
    });

    act(() => {
      result.current.addItem(bannerSectionId!, 'text', {
        title: 'Hero Title',
        subtitle: 'Hero Subtitle',
        description: 'Hero Description',
      });
    });

    act(() => {
      result.current.addItem(bannerSectionId!, 'button', {
        title: 'Call to Action',
        actionUrl: 'https://example.com/cta',
        buttonText: 'Learn More',
      });
    });

    // Добавляем секцию grid
    act(() => {
      result.current.addSection('grid', 'Product Grid');
    });

    const gridSectionId = result.current.config?.sections[1].id;
    expect(gridSectionId).toBeDefined();

    // Добавляем продукты в grid
    act(() => {
      result.current.addItem(gridSectionId!, 'product', {
        title: 'Product 1',
        price: '$99.99',
        imageUrl: 'https://example.com/product1.jpg',
        actionUrl: 'https://example.com/product1',
        layout: 'vertical',
        showButton: true,
        buttonText: 'Buy Now',
      });
    });

    act(() => {
      result.current.addItem(gridSectionId!, 'product', {
        title: 'Product 2',
        price: '$149.99',
        imageUrl: 'https://example.com/product2.jpg',
        actionUrl: 'https://example.com/product2',
        layout: 'horizontal',
        showButton: true,
        buttonText: 'View Details',
      });
    });

    // Добавляем секцию verticalList
    act(() => {
      result.current.addSection('verticalList', 'Categories');
    });

    const listSectionId = result.current.config?.sections[2].id;
    expect(listSectionId).toBeDefined();

    // Добавляем категории
    act(() => {
      result.current.addItem(listSectionId!, 'category', {
        title: 'Electronics',
        imageUrl: 'https://example.com/electronics.jpg',
        actionUrl: 'https://example.com/electronics',
      });
    });

    act(() => {
      result.current.addItem(listSectionId!, 'category', {
        title: 'Clothing',
        imageUrl: 'https://example.com/clothing.jpg',
        actionUrl: 'https://example.com/clothing',
      });
    });

    // Проверяем финальную структуру
    const finalConfig = result.current.config;
    expect(finalConfig).toBeDefined();
    expect(finalConfig!.sections).toHaveLength(3);

    // Проверяем banner секцию
    const bannerSection = finalConfig!.sections[0];
    expect(bannerSection.type).toBe('banner');
    expect(bannerSection.title).toBe('Hero Banner');
    expect(bannerSection.items).toHaveLength(3);
    expect(bannerSection.items[0].type).toBe('image');
    expect(bannerSection.items[1].type).toBe('text');
    expect(bannerSection.items[2].type).toBe('button');

    // Проверяем grid секцию
    const gridSection = finalConfig!.sections[1];
    expect(gridSection.type).toBe('grid');
    expect(gridSection.title).toBe('Product Grid');
    expect(gridSection.items).toHaveLength(2);
    expect(gridSection.items[0].type).toBe('product');
    expect(gridSection.items[1].type).toBe('product');

    // Проверяем list секцию
    const listSection = finalConfig!.sections[2];
    expect(listSection.type).toBe('verticalList');
    expect(listSection.title).toBe('Categories');
    expect(listSection.items).toHaveLength(2);
    expect(listSection.items[0].type).toBe('category');
    expect(listSection.items[1].type).toBe('category');

    // Проверяем JSON представление
    const jsonRepresentation = result.current.getJsonRepresentation();
    expect(() => JSON.parse(jsonRepresentation)).not.toThrow();

    const parsedJson = JSON.parse(jsonRepresentation);
    expect(parsedJson.name).toBe('Integration Test Config');
    expect(parsedJson.sections).toHaveLength(3);
    expect(parsedJson.sections[0].items).toHaveLength(3);
    expect(parsedJson.sections[1].items).toHaveLength(2);
    expect(parsedJson.sections[2].items).toHaveLength(2);
  });

  it('should handle complex operations and maintain data integrity', () => {
    const { result } = renderHook(() => useScreenConfig());

    // Создаем базовую конфигурацию
    const baseConfig: ScreenConfig = {
      _id: 'complex-test-1',
      id: 'complex-test-1',
      name: 'Complex Test Config',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: false,
      version: 1,
    };

    act(() => {
      result.current.setConfig(baseConfig);
    });

    // Добавляем несколько секций
    act(() => {
      result.current.addSection('hero', 'Main Hero');
    });

    act(() => {
      result.current.addSection('horizontalList', 'Featured Products');
    });

    act(() => {
      result.current.addSection('banner', 'Promotional Banner');
    });

    expect(result.current.config?.sections).toHaveLength(3);

    // Добавляем элементы в каждую секцию
    const heroSectionId = result.current.config?.sections[0].id!;
    const listSectionId = result.current.config?.sections[1].id!;
    const bannerSectionId = result.current.config?.sections[2].id!;

    // Hero секция
    act(() => {
      result.current.addItem(heroSectionId, 'image', {
        title: 'Hero Background',
        imageUrl: 'https://example.com/hero-bg.jpg',
      });
    });

    act(() => {
      result.current.addItem(heroSectionId, 'text', {
        title: 'Welcome to Our Store',
        subtitle: 'Best Products, Best Prices',
      });
    });

    // Featured Products секция
    for (let i = 1; i <= 5; i++) {
      act(() => {
        result.current.addItem(listSectionId, 'product', {
          title: `Featured Product ${i}`,
          price: `$${(i * 25).toFixed(2)}`,
          imageUrl: `https://example.com/product${i}.jpg`,
        });
      });
    }

    // Banner секция
    act(() => {
      result.current.addItem(bannerSectionId, 'button', {
        title: 'Special Offer',
        buttonText: 'Shop Now',
        actionUrl: 'https://example.com/sale',
      });
    });

    // Проверяем количество элементов
    expect(result.current.config?.sections[0].items).toHaveLength(2);
    expect(result.current.config?.sections[1].items).toHaveLength(5);
    expect(result.current.config?.sections[2].items).toHaveLength(1);

    // Обновляем элементы
    const firstProductId = result.current.config?.sections[1].items[0].id!;
    act(() => {
      result.current.updateItem(listSectionId, firstProductId, {
        content: {
          title: 'Updated Featured Product 1',
          price: '$199.99',
          tags: ['featured', 'bestseller'],
        },
      });
    });

    // Проверяем обновление
    const updatedProduct = result.current.config?.sections[1].items[0];
    expect(updatedProduct?.content.title).toBe('Updated Featured Product 1');
    expect(updatedProduct?.content.price).toBe('$199.99');
    expect(updatedProduct?.content.tags).toEqual(['featured', 'bestseller']);

    // Удаляем элемент
    const secondProductId = result.current.config?.sections[1].items[1].id!;
    act(() => {
      result.current.deleteItem(listSectionId, secondProductId);
    });

    expect(result.current.config?.sections[1].items).toHaveLength(4);

    // Обновляем секцию
    act(() => {
      result.current.updateSection(heroSectionId, {
        title: 'Updated Hero Section',
        settings: {
          backgroundColor: '#f0f0f0',
          padding: '20px',
          useGradient: true,
          gradientColor: '#ff6b6b',
          gradientDirection: 'to right',
        },
      });
    });

    // Проверяем обновление секции
    const updatedHeroSection = result.current.config?.sections[0];
    expect(updatedHeroSection?.title).toBe('Updated Hero Section');
    expect(updatedHeroSection?.settings?.backgroundColor).toBe('#f0f0f0');
    expect(updatedHeroSection?.settings?.useGradient).toBe(true);

    // Удаляем секцию
    act(() => {
      result.current.deleteSection(bannerSectionId);
    });

    expect(result.current.config?.sections).toHaveLength(2);

    // Финальная проверка JSON
    const finalJson = result.current.getJsonRepresentation();
    const parsedFinalJson = JSON.parse(finalJson);

    expect(parsedFinalJson.sections).toHaveLength(2);
    expect(parsedFinalJson.sections[0].title).toBe('Updated Hero Section');
    expect(parsedFinalJson.sections[1].items).toHaveLength(4);
    expect(parsedFinalJson.sections[0].settings.useGradient).toBe(true);
  });

  it('should preserve data integrity during complex manipulations', () => {
    const { result } = renderHook(() => useScreenConfig());

    // Создаем конфигурацию с данными
    const initialConfig: ScreenConfig = {
      _id: 'integrity-test-1',
      id: 'integrity-test-1',
      name: 'Data Integrity Test',
      sections: [
        {
          id: 'section-1',
          type: 'grid',
          title: 'Test Grid',
          items: [
            {
              id: 'item-1',
              type: 'product',
              content: {
                title: 'Original Product',
                price: '$50.00',
                imageUrl: 'https://example.com/original.jpg',
              },
            },
          ],
          settings: {
            backgroundColor: '#ffffff',
            gridColumns: 3,
          },
        },
      ],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      isActive: false,
      version: 1,
    };

    act(() => {
      result.current.setConfig(initialConfig);
    });

    // Сохраняем исходные данные для сравнения
    const originalJson = result.current.getJsonRepresentation();
    const originalParsed = JSON.parse(originalJson);

    // Выполняем серию операций
    act(() => {
      result.current.addItem('section-1', 'product', {
        title: 'New Product',
        price: '$75.00',
      });
    });

    act(() => {
      result.current.updateItem('section-1', 'item-1', {
        content: {
          title: 'Updated Original Product',
          price: '$55.00',
          description: 'Updated description',
        },
      });
    });

    act(() => {
      result.current.updateSection('section-1', {
        settings: {
          backgroundColor: '#f5f5f5',
          gridColumns: 4,
          padding: '16px',
        },
      });
    });

    // Проверяем, что изменения применились корректно
    const updatedConfig = result.current.config!;

    // Проверяем структуру
    expect(updatedConfig.sections).toHaveLength(1);
    expect(updatedConfig.sections[0].items).toHaveLength(2);

    // Проверяем обновленный элемент
    const updatedItem = updatedConfig.sections[0].items[0];
    expect(updatedItem.content.title).toBe('Updated Original Product');
    expect(updatedItem.content.price).toBe('$55.00');
    expect(updatedItem.content.description).toBe('Updated description');

    // Проверяем новый элемент
    const newItem = updatedConfig.sections[0].items[1];
    expect(newItem.content.title).toBe('New Product');
    expect(newItem.content.price).toBe('$75.00');

    // Проверяем обновленные настройки секции
    const updatedSection = updatedConfig.sections[0];
    expect(updatedSection.settings?.backgroundColor).toBe('#f5f5f5');
    expect(updatedSection.settings?.gridColumns).toBe(4);
    expect(updatedSection.settings?.padding).toBe('16px');

    // Проверяем, что базовые поля остались неизменными
    expect(updatedConfig._id).toBe(originalParsed._id);
    expect(updatedConfig.name).toBe(originalParsed.name);
    expect(updatedConfig.version).toBe(originalParsed.version);
    expect(updatedConfig.createdAt).toBe(originalParsed.createdAt);

    // Проверяем, что updatedAt изменился
    expect(updatedConfig.updatedAt).not.toBe(originalParsed.updatedAt);

    // Финальная проверка JSON валидности
    const finalJson = result.current.getJsonRepresentation();
    expect(() => JSON.parse(finalJson)).not.toThrow();

    const finalParsed = JSON.parse(finalJson);
    expect(finalParsed.sections[0].items).toHaveLength(2);
    expect(finalParsed.sections[0].settings.gridColumns).toBe(4);
  });
});

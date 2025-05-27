import type { Item, ScreenConfig, Section } from '@/types';

// Утилиты для создания мок данных
export const createMockItem = (overrides: Partial<Item> = {}): Item => ({
  id: 'item-1',
  type: 'text',
  content: {
    title: 'Test Item',
    subtitle: 'Test Subtitle',
    description: 'Test Description',
  },
  ...overrides,
});

export const createMockSection = (overrides: Partial<Section> = {}): Section => ({
  id: 'section-1',
  type: 'banner',
  title: 'Test Section',
  items: [createMockItem()],
  settings: {
    backgroundColor: '#ffffff',
    padding: '16px',
  },
  ...overrides,
});

export const createMockScreenConfig = (overrides: Partial<ScreenConfig> = {}): ScreenConfig => ({
  _id: 'config-1',
  id: 'config-1',
  name: 'Test Screen Config',
  sections: [createMockSection()],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  isActive: true,
  version: 1,
  ...overrides,
});

// Функция для сериализации в JSON
export const serializeToJson = (data: any): string => {
  return JSON.stringify(data, null, 2);
};

// Функция для валидации JSON структуры
export const validateJsonStructure = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
};

describe('Screen Config Utils', () => {
  describe('createMockItem', () => {
    it('should create a mock item with default values', () => {
      const item = createMockItem();

      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('content');
      expect(item.type).toBe('text');
      expect(item.content.title).toBe('Test Item');
    });

    it('should override default values', () => {
      const item = createMockItem({
        id: 'custom-id',
        type: 'image',
        content: { title: 'Custom Title' },
      });

      expect(item.id).toBe('custom-id');
      expect(item.type).toBe('image');
      expect(item.content.title).toBe('Custom Title');
    });
  });

  describe('createMockSection', () => {
    it('should create a mock section with default values', () => {
      const section = createMockSection();

      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('type');
      expect(section).toHaveProperty('items');
      expect(section.type).toBe('banner');
      expect(section.items).toHaveLength(1);
    });

    it('should override default values', () => {
      const section = createMockSection({
        type: 'grid',
        title: 'Custom Section',
      });

      expect(section.type).toBe('grid');
      expect(section.title).toBe('Custom Section');
    });
  });

  describe('createMockScreenConfig', () => {
    it('should create a mock screen config with default values', () => {
      const config = createMockScreenConfig();

      expect(config).toHaveProperty('_id');
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('sections');
      expect(config.name).toBe('Test Screen Config');
      expect(config.sections).toHaveLength(1);
      expect(config.isActive).toBe(true);
    });

    it('should override default values', () => {
      const config = createMockScreenConfig({
        name: 'Custom Config',
        isActive: false,
      });

      expect(config.name).toBe('Custom Config');
      expect(config.isActive).toBe(false);
    });
  });

  describe('serializeToJson', () => {
    it('should serialize object to JSON string', () => {
      const data = { test: 'value', number: 123 };
      const json = serializeToJson(data);

      expect(typeof json).toBe('string');
      expect(json).toContain('"test": "value"');
      expect(json).toContain('"number": 123');
    });

    it('should serialize screen config to JSON', () => {
      const config = createMockScreenConfig();
      const json = serializeToJson(config);

      expect(validateJsonStructure(json)).toBe(true);
      expect(json).toContain('"name": "Test Screen Config"');
      expect(json).toContain('"isActive": true');
    });
  });

  describe('validateJsonStructure', () => {
    it('should validate correct JSON string', () => {
      const validJson = '{"test": "value"}';
      expect(validateJsonStructure(validJson)).toBe(true);
    });

    it('should reject invalid JSON string', () => {
      const invalidJson = '{"test": value}'; // missing quotes
      expect(validateJsonStructure(invalidJson)).toBe(false);
    });

    it('should reject non-object JSON', () => {
      const primitiveJson = '"just a string"';
      expect(validateJsonStructure(primitiveJson)).toBe(false);
    });
  });
});

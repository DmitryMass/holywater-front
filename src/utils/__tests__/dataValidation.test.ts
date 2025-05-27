import type { Item, ScreenConfig, Section } from '@/types';

// Функции валидации
export const validateScreenConfig = (config: any): config is ScreenConfig => {
  if (!config || typeof config !== 'object') return false;

  const requiredFields = [
    '_id',
    'name',
    'sections',
    'createdAt',
    'updatedAt',
    'isActive',
    'version',
  ];

  for (const field of requiredFields) {
    if (!(field in config)) return false;
  }

  if (typeof config.name !== 'string') return false;
  if (!Array.isArray(config.sections)) return false;
  if (typeof config.isActive !== 'boolean') return false;
  if (typeof config.version !== 'number') return false;

  return config.sections.every(validateSection);
};

export const validateSection = (section: any): section is Section => {
  if (!section || typeof section !== 'object') return false;

  const requiredFields = ['id', 'type', 'items'];

  for (const field of requiredFields) {
    if (!(field in section)) return false;
  }

  const validSectionTypes = ['banner', 'verticalList', 'horizontalList', 'grid', 'hero'];
  if (!validSectionTypes.includes(section.type)) return false;

  if (!Array.isArray(section.items)) return false;

  return section.items.every(validateItem);
};

export const validateItem = (item: any): item is Item => {
  if (!item || typeof item !== 'object') return false;

  const requiredFields = ['id', 'type', 'content'];

  for (const field of requiredFields) {
    if (!(field in item)) return false;
  }

  const validItemTypes = ['image', 'text', 'button', 'product', 'category'];
  if (!validItemTypes.includes(item.type)) return false;

  if (!item.content || typeof item.content !== 'object') return false;

  return true;
};

export const validateJsonString = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
};

export const sanitizeJsonString = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch {
    return '{}';
  }
};

describe('Data Validation Utils', () => {
  describe('validateScreenConfig', () => {
    it('should validate correct ScreenConfig', () => {
      const validConfig: ScreenConfig = {
        _id: 'config-1',
        id: 'config-1',
        name: 'Test Config',
        sections: [
          {
            id: 'section-1',
            type: 'banner',
            items: [
              {
                id: 'item-1',
                type: 'text',
                content: { title: 'Test' },
              },
            ],
          },
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        isActive: true,
        version: 1,
      };

      expect(validateScreenConfig(validConfig)).toBe(true);
    });

    it('should reject config without required fields', () => {
      const invalidConfig = {
        name: 'Test Config',
        sections: [],
      };

      expect(validateScreenConfig(invalidConfig)).toBe(false);
    });

    it('should reject config with invalid name type', () => {
      const invalidConfig = {
        _id: 'config-1',
        name: 123, // должно быть строкой
        sections: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        isActive: true,
        version: 1,
      };

      expect(validateScreenConfig(invalidConfig)).toBe(false);
    });

    it('should reject config with invalid sections', () => {
      const invalidConfig = {
        _id: 'config-1',
        name: 'Test Config',
        sections: 'not an array',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        isActive: true,
        version: 1,
      };

      expect(validateScreenConfig(invalidConfig)).toBe(false);
    });

    it('should reject null or undefined config', () => {
      expect(validateScreenConfig(null)).toBe(false);
      expect(validateScreenConfig(undefined)).toBe(false);
    });
  });

  describe('validateSection', () => {
    it('should validate correct Section', () => {
      const validSection: Section = {
        id: 'section-1',
        type: 'banner',
        items: [
          {
            id: 'item-1',
            type: 'text',
            content: { title: 'Test' },
          },
        ],
      };

      expect(validateSection(validSection)).toBe(true);
    });

    it('should reject section without required fields', () => {
      const invalidSection = {
        id: 'section-1',
        type: 'banner',
        // отсутствует items
      };

      expect(validateSection(invalidSection)).toBe(false);
    });

    it('should reject section with invalid type', () => {
      const invalidSection = {
        id: 'section-1',
        type: 'invalid-type',
        items: [],
      };

      expect(validateSection(invalidSection)).toBe(false);
    });

    it('should reject section with invalid items', () => {
      const invalidSection = {
        id: 'section-1',
        type: 'banner',
        items: 'not an array',
      };

      expect(validateSection(invalidSection)).toBe(false);
    });

    it('should validate all section types', () => {
      const sectionTypes = ['banner', 'verticalList', 'horizontalList', 'grid', 'hero'];

      sectionTypes.forEach((type) => {
        const section = {
          id: 'section-1',
          type,
          items: [],
        };

        expect(validateSection(section)).toBe(true);
      });
    });
  });

  describe('validateItem', () => {
    it('should validate correct Item', () => {
      const validItem: Item = {
        id: 'item-1',
        type: 'text',
        content: { title: 'Test' },
      };

      expect(validateItem(validItem)).toBe(true);
    });

    it('should reject item without required fields', () => {
      const invalidItem = {
        id: 'item-1',
        type: 'text',
        // отсутствует content
      };

      expect(validateItem(invalidItem)).toBe(false);
    });

    it('should reject item with invalid type', () => {
      const invalidItem = {
        id: 'item-1',
        type: 'invalid-type',
        content: { title: 'Test' },
      };

      expect(validateItem(invalidItem)).toBe(false);
    });

    it('should reject item with invalid content', () => {
      const invalidItem = {
        id: 'item-1',
        type: 'text',
        content: 'not an object',
      };

      expect(validateItem(invalidItem)).toBe(false);
    });

    it('should validate all item types', () => {
      const itemTypes = ['image', 'text', 'button', 'product', 'category'];

      itemTypes.forEach((type) => {
        const item = {
          id: 'item-1',
          type,
          content: { title: 'Test' },
        };

        expect(validateItem(item)).toBe(true);
      });
    });
  });

  describe('validateJsonString', () => {
    it('should validate correct JSON string', () => {
      const validJson = '{"test": "value", "number": 123}';
      expect(validateJsonString(validJson)).toBe(true);
    });

    it('should reject invalid JSON string', () => {
      const invalidJson = '{"test": value}'; // missing quotes
      expect(validateJsonString(invalidJson)).toBe(false);
    });

    it('should reject primitive JSON values', () => {
      expect(validateJsonString('"just a string"')).toBe(false);
      expect(validateJsonString('123')).toBe(false);
      expect(validateJsonString('true')).toBe(false);
      expect(validateJsonString('null')).toBe(false);
    });

    it('should validate empty object', () => {
      expect(validateJsonString('{}')).toBe(true);
    });

    it('should validate arrays', () => {
      expect(validateJsonString('[]')).toBe(true);
      expect(validateJsonString('[1, 2, 3]')).toBe(true);
    });
  });

  describe('sanitizeJsonString', () => {
    it('should return sanitized JSON for valid input', () => {
      const input = '{"test": "value", "number": 123}';
      const expected = '{"test":"value","number":123}';
      expect(sanitizeJsonString(input)).toBe(expected);
    });

    it('should return empty object for invalid JSON', () => {
      const invalidJson = '{"test": value}';
      expect(sanitizeJsonString(invalidJson)).toBe('{}');
    });

    it('should handle empty string', () => {
      expect(sanitizeJsonString('')).toBe('{}');
    });

    it('should normalize whitespace', () => {
      const input = `{
        "test": "value",
        "number": 123
      }`;
      const expected = '{"test":"value","number":123}';
      expect(sanitizeJsonString(input)).toBe(expected);
    });
  });
});

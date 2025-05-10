import type { Item, ItemType, ScreenConfig, Section, SectionType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

import { useCallback, useEffect, useState } from 'react';

interface UseScreenConfigReturn {
  config: ScreenConfig | null;
  setConfig: (config: ScreenConfig | null) => void;

  // Методы для работы с секциями
  addSection: (type: SectionType, title?: string) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;

  // Методы для работы с элементами
  addItem: (sectionId: string, type: ItemType, content?: Partial<Item['content']>) => void;
  updateItem: (sectionId: string, itemId: string, updates: Partial<Item>) => void;
  deleteItem: (sectionId: string, itemId: string) => void;
  moveItem: (
    sectionId: string,
    itemId: string,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => void;

  // Получение выбранных элементов
  selectedSectionId: string | null;
  selectedItemId: string | null;
  selectedSection: Section | null;
  selectedItem: Item | null;

  // Методы для выбора элементов
  selectSection: (sectionId: string | null) => void;
  selectItem: (sectionId: string | null, itemId: string | null) => void;

  // Получение JSON представления
  getJsonRepresentation: () => string;
}

export const useScreenConfig = (
  initialConfig: ScreenConfig | null = null
): UseScreenConfigReturn => {
  const [config, setConfig] = useState<ScreenConfig | null>(initialConfig);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Обновляем состояние, когда меняется initialConfig
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Выбор секции
  const selectSection = useCallback((sectionId: string | null) => {
    setSelectedSectionId(sectionId);
    setSelectedItemId(null);
  }, []);

  // Выбор элемента внутри секции
  const selectItem = useCallback((sectionId: string | null, itemId: string | null) => {
    setSelectedSectionId(sectionId);
    setSelectedItemId(itemId);
  }, []);

  // Получение выбранной секции
  const selectedSection =
    selectedSectionId && config
      ? config.sections.find((s) => s.id === selectedSectionId) || null
      : null;

  // Получение выбранного элемента
  const selectedItem =
    selectedSection && selectedItemId
      ? selectedSection.items.find((i) => i.id === selectedItemId) || null
      : null;

  // Добавление новой секции
  const addSection = useCallback(
    (type: SectionType, title: string = '') => {
      if (!config) return;

      const newSection: Section = {
        id: uuidv4(),
        type,
        title,
        items: [],
        settings: {
          backgroundColor: '#ffffff',
          padding: '15px',
          borderRadius: '8px',
          showTitle: !!title,
        },
      };

      setConfig({
        ...config,
        sections: [...config.sections, newSection],
        updatedAt: new Date().toISOString(),
      });

      // Выбираем новую секцию
      selectSection(newSection.id);
    },
    [config, selectSection]
  );

  // Обновление секции
  const updateSection = useCallback(
    (sectionId: string, updates: Partial<Section>) => {
      if (!config) return;

      const sectionIndex = config.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return;

      const updatedSections = [...config.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        ...updates,
      };

      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });
    },
    [config]
  );

  // Удаление секции
  const deleteSection = useCallback(
    (sectionId: string) => {
      if (!config) return;

      const updatedSections = config.sections.filter((s) => s.id !== sectionId);

      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });

      // Снимаем выделение, если удалена выбранная секция
      if (selectedSectionId === sectionId) {
        selectSection(null);
      }
    },
    [config, selectedSectionId, selectSection]
  );

  // Перемещение секции
  const moveSection = useCallback(
    (sectionId: string, direction: 'up' | 'down') => {
      if (!config) return;

      const sectionIndex = config.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return;

      // Проверяем возможность перемещения
      if (direction === 'up' && sectionIndex === 0) return;
      if (direction === 'down' && sectionIndex === config.sections.length - 1) return;

      const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
      const updatedSections = [...config.sections];

      // Меняем секции местами
      [updatedSections[sectionIndex], updatedSections[newIndex]] = [
        updatedSections[newIndex],
        updatedSections[sectionIndex],
      ];

      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });
    },
    [config]
  );

  // Добавление нового элемента
  const addItem = useCallback(
    (sectionId: string, type: ItemType, content: Partial<Item['content']> = {}) => {
      if (!config) return;

      const sectionIndex = config.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return;

      const newItem: Item = {
        id: uuidv4(),
        type,
        content: {
          title: '',
          ...content,
        },
      };

      const updatedSections = [...config.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items: [...updatedSections[sectionIndex].items, newItem],
      };

      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });

      // Выбираем новый элемент
      selectItem(sectionId, newItem.id);
    },
    [config, selectItem]
  );

  // Обновление элемента
  const updateItem = useCallback(
    (sectionId: string, itemId: string, updates: Partial<Item>) => {
      if (!config) return;

      const sectionIndex = config.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return;

      const itemIndex = config.sections[sectionIndex].items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return;

      const updatedSections = [...config.sections];
      const updatedItems = [...updatedSections[sectionIndex].items];

      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        ...updates,
        content: {
          ...updatedItems[itemIndex].content,
          ...(updates.content || {}),
        },
      };

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items: updatedItems,
      };

      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });
    },
    [config]
  );

  // Удаление элемента
  const deleteItem = useCallback(
    (sectionId: string, itemId: string) => {
      if (!config) return;

      const sectionIndex = config.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return;

      const updatedSections = [...config.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items: updatedSections[sectionIndex].items.filter((i) => i.id !== itemId),
      };

      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });

      // Снимаем выделение, если удален выбранный элемент
      if (selectedItemId === itemId) {
        selectItem(sectionId, null);
      }
    },
    [config, selectedItemId, selectItem]
  );

  // Перемещение элемента
  const moveItem = useCallback(
    (sectionId: string, itemId: string, direction: 'up' | 'down' | 'left' | 'right') => {
      if (!config) return;

      const sectionIndex = config.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return;

      const itemIndex = config.sections[sectionIndex].items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return;

      const updatedSections = [...config.sections];
      const items = [...updatedSections[sectionIndex].items];

      if (direction === 'up' || direction === 'down') {
        // Проверяем возможность перемещения
        if (direction === 'up' && itemIndex === 0) return;
        if (direction === 'down' && itemIndex === items.length - 1) return;

        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;

        // Меняем элементы местами
        [items[itemIndex], items[newIndex]] = [items[newIndex], items[itemIndex]];

        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          items,
        };
      } else if (direction === 'left' || direction === 'right') {
        // Перемещение между секциями
        // Для этого нужно определить индекс секции слева или справа
        const currentSectionIndex = sectionIndex;
        const targetSectionIndex =
          direction === 'left' ? currentSectionIndex - 1 : currentSectionIndex + 1;

        if (targetSectionIndex < 0 || targetSectionIndex >= config.sections.length) return;

        // Извлекаем элемент
        const [movedItem] = items.splice(itemIndex, 1);

        // Добавляем его в целевую секцию
        updatedSections[targetSectionIndex] = {
          ...updatedSections[targetSectionIndex],
          items: [...updatedSections[targetSectionIndex].items, movedItem],
        };

        updatedSections[currentSectionIndex] = {
          ...updatedSections[currentSectionIndex],
          items,
        };

        // Обновляем выбранную секцию и элемент
        selectItem(updatedSections[targetSectionIndex].id, movedItem.id);
      }

      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });
    },
    [config, selectItem]
  );

  // Получение JSON представления конфигурации
  const getJsonRepresentation = useCallback(() => {
    if (!config) return '{}';
    return JSON.stringify(config, null, 2);
  }, [config]);

  return {
    config,
    setConfig,

    addSection,
    updateSection,
    deleteSection,
    moveSection,

    addItem,
    updateItem,
    deleteItem,
    moveItem,

    selectedSectionId,
    selectedItemId,
    selectedSection,
    selectedItem,

    selectSection,
    selectItem,

    getJsonRepresentation,
  };
};

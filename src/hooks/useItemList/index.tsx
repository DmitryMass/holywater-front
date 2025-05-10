import type { Section } from '@/types';
import { PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import { useMemo } from 'react';

export interface UseItemListProps {
  section: Section;
  selectedItemId: string | null;
  onItemDragEnd: (event: DragEndEvent) => void;
}

export const useItemList = ({ section }: UseItemListProps) => {
  // Проверяем, что section и section.items определены
  const validSection = section && typeof section === 'object';
  const validItems = validSection && Array.isArray(section.items);

  // Настраиваем сенсоры для drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Получаем список ID элементов для SortableContext
  const itemIds = useMemo(() => {
    if (!validSection || !validItems) {
      console.warn('Секция или элементы секции не определены:', section);
      return [];
    }
    return section.items.map((item) => item?.id || '');
  }, [validSection, validItems, section]);

  // Определяем количество колонок из настроек или по умолчанию
  const gridColumns = useMemo(
    () => (validSection && section.settings?.gridColumns) || '2',
    [validSection, section?.settings?.gridColumns]
  );

  // Создаем CSS класс для grid в зависимости от выбранного количества колонок
  const gridClass = useMemo(() => `grid gap-4 grid-cols-${gridColumns}`, [gridColumns]);

  // Определяем коллизии для drag-and-drop
  const collisionDetection = closestCenter;

  return {
    sensors,
    itemIds,
    gridColumns,
    gridClass,
    collisionDetection,
  };
};

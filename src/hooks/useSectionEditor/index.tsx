import type { Section } from '@/types';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';

import React from 'react';

export interface UseSectionEditorProps {
  section: Section;
  isSelected: boolean;
  onSectionChange: (section: Section) => void;
  onSectionDelete: (sectionId: string) => void;
  onSectionMove: (sectionId: string, direction: 'up' | 'down') => void;
  onSectionSelect: (sectionId: string) => void;
  onItemSelect: (sectionId: string, itemId: string) => void;
  selectedItemId: string | null;
  onItemDelete?: (sectionId: string, itemId: string) => void;
}

export const useSectionEditor = ({
  section,
  onSectionChange,
  onSectionDelete,
  onSectionMove,
  onSectionSelect,
  onItemDelete,
}: UseSectionEditorProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleSectionClick = (e: React.MouseEvent) => {
    // Предотвращаем всплытие события, чтобы не сработал клик на родительском элементе
    e.stopPropagation();
    onSectionSelect(section.id);
  };

  const handleDeleteClick = () => {
    onSectionDelete(section.id);
  };

  const handleMoveUp = () => {
    onSectionMove(section.id, 'up');
  };

  const handleMoveDown = () => {
    onSectionMove(section.id, 'down');
  };

  // Обработчик удаления элемента
  const handleItemDelete = (itemId: string) => {
    if (onItemDelete) {
      onItemDelete(section.id, itemId);
    }
  };

  // Обработчик завершения перетаскивания элементов
  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedItems = arrayMove(section.items, oldIndex, newIndex);
        onSectionChange({
          ...section,
          items: updatedItems,
        });
      }
    }
  };

  // Вычисляем стили секции с учетом возможного градиента
  const getSectionStyles = (): React.CSSProperties => {
    const sectionStyles: React.CSSProperties = {
      padding: section.settings?.padding || '15px',
      borderRadius: section.settings?.borderRadius || '8px',
    };

    // Если включен градиент, применяем его
    if (section.settings?.useGradient && section.settings?.gradientColor) {
      sectionStyles.background = `linear-gradient(${
        section.settings.gradientDirection || 'to right'
      }, ${section.settings.backgroundColor || '#ffffff'}, ${section.settings.gradientColor})`;
    } else {
      sectionStyles.backgroundColor = section.settings?.backgroundColor || '#ffffff';
    }

    return sectionStyles;
  };

  // Вычисляем количество колонок для сетки
  const getGridColumns = (): string => {
    return String(section.settings?.gridColumns || '2');
  };

  return {
    // Свойства для drag-and-drop
    attributes,
    listeners,
    setNodeRef,
    style,
    isDragging,

    // Обработчики
    handleSectionClick,
    handleDeleteClick,
    handleMoveUp,
    handleMoveDown,
    handleItemDelete,
    handleItemDragEnd,

    // Стили и параметры
    getSectionStyles,
    getGridColumns,
  };
};

import type { Item } from '@/types';
import { useSortable } from '@dnd-kit/sortable';

import { useCallback } from 'react';

export interface UseItemEditorProps {
  item: Item;
  onClick: () => void;
  onDelete?: () => void;
}

export const useItemEditor = ({ item, onClick, onDelete }: UseItemEditorProps) => {
  // Добавляем поддержку drag-and-drop
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Обработчик клика по кнопке удаления
  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Предотвращаем всплытие события, чтобы не сработал клик на родительском элементе
      if (onDelete) {
        onDelete();
      }
    },
    [onDelete]
  );

  // Отдельный обработчик для клика на элемент для выбора
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    },
    [onClick]
  );

  // Рендерим содержимое элемента в зависимости от его типа
  const getItemContent = () => {
    switch (item.type) {
      case 'image':
        return {
          imageUrl: item.content.imageUrl,
          title: item.content.title,
          subtitle: item.content.subtitle,
          tags: item.content.tags,
          url: item.content.url,
          link: item.content.link,
          description: item.content.description,
          layout: item.content.layout,
          showButton: item.content.showButton,
          buttonText: item.content.buttonText,
        };

      case 'text':
        return {
          title: item.content.title,
          description: item.content.description,
          tags: item.content.tags,
        };

      case 'button':
        return {
          title: item.content.title || 'Кнопка',
        };

      case 'product':
        return {
          imageUrl: item.content.imageUrl,
          title: item.content.title || 'Название сериала',
          price: item.content.price,
          subtitle: item.content.subtitle,
          tags: item.content.tags,
          url: item.content.url,
          link: item.content.link,
          description: item.content.description,
          layout: item.content.layout,
          showButton: item.content.showButton,
          buttonText: item.content.buttonText,
        };

      case 'category':
        return {
          imageUrl: item.content.imageUrl,
          title: item.content.title || 'Категория',
          tags: item.content.tags,
          url: item.content.url,
          link: item.content.link,
        };

      default:
        return {};
    }
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    style,
    isDragging,
    handleDeleteClick,
    handleClick,
    itemType: item.type,
    itemContent: getItemContent(),
  };
};

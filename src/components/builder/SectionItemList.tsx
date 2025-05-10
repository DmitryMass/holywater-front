import { useItemList } from '@/hooks/useItemList';
import type { Item, Section } from '@/types';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import ItemEditor from './ItemEditor';

export const SectionItemList = ({
  section,
  onItemSelect,
  selectedItemId,
  onItemDragEnd,
  onItemDelete,
}: {
  section: Section;
  onItemSelect: (sectionId: string, itemId: string) => void;
  selectedItemId: string | null;
  onItemDragEnd: (event: DragEndEvent) => void;
  onItemDelete?: (itemId: string) => void;
}) => {
  // Получаем в безопасном режиме свойства для drag-and-drop
  const { sensors, itemIds, gridClass, collisionDetection } = useItemList({
    section,
    selectedItemId,
    onItemDragEnd,
  });

  // Проверяем, что section и section.items существуют и валидны
  if (!section || typeof section !== 'object') {
    return (
      <div className="border-error rounded-md border border-dashed p-8 text-center">
        <p className="text-error">Помилка: Невалідна секція</p>
      </div>
    );
  }

  if (!section.items || !Array.isArray(section.items)) {
    return (
      <div className="border-warning rounded-md border border-dashed p-8 text-center">
        <p className="text-warning">Помилка: Секція не містить елементів</p>
      </div>
    );
  }

  // Отображение одного элемента
  const renderItem = (item: Item) => {
    if (!item || typeof item !== 'object' || !item.id) {
      return (
        <div className="border-error rounded-md border border-dashed p-3 text-center">
          <p className="text-error">Помилка: Невалідний елемент</p>
        </div>
      );
    }

    return (
      <ItemEditor
        item={item}
        isSelected={item.id === selectedItemId}
        onClick={() => onItemSelect(section.id, item.id)}
        onDelete={onItemDelete ? () => onItemDelete(item.id) : undefined}
      />
    );
  };

  // В зависимости от типа секции выбираем способ отображения элементов
  switch (section.type || 'default') {
    case 'banner':
      // Баннеры обычно один элемент на всю ширину
      return (
        <DndContext
          sensors={sensors}
          onDragEnd={onItemDragEnd}
          collisionDetection={collisionDetection}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {section.items.map((item) => (
              <div key={item.id} className="mb-2">
                {renderItem(item)}
              </div>
            ))}
          </SortableContext>
        </DndContext>
      );

    case 'horizontalList':
      // Горизонтальный список элементов
      return (
        <DndContext
          sensors={sensors}
          onDragEnd={onItemDragEnd}
          collisionDetection={collisionDetection}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="flex gap-4 overflow-x-auto p-2">
              {section.items.map((item) => (
                <div key={item.id} className="w-1/4 min-w-[150px]">
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );

    case 'verticalList':
      // Вертикальный список элементов
      return (
        <DndContext
          sensors={sensors}
          onDragEnd={onItemDragEnd}
          collisionDetection={collisionDetection}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {section.items.map((item) => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );

    case 'grid':
      // Сетка элементов
      return (
        <DndContext
          sensors={sensors}
          onDragEnd={onItemDragEnd}
          collisionDetection={collisionDetection}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className={gridClass}>
              {section.items.map((item) => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );

    case 'hero':
      // Герой-секция - полноэкранная секция для особенно важного контента
      return (
        <DndContext
          sensors={sensors}
          onDragEnd={onItemDragEnd}
          collisionDetection={collisionDetection}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="relative min-h-[300px] w-full overflow-hidden rounded-lg">
              {section.items.map((item) => (
                <div key={item.id} className="h-full w-full">
                  {renderItem(item)}
                </div>
              ))}

              {section.items.length === 0 && (
                <div className="bg-base-200 flex h-[300px] w-full items-center justify-center rounded-lg">
                  <p className="text-base-content">Добавьте контент для герой-секции</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      );

    default:
      // Стандартное отображение
      return (
        <DndContext
          sensors={sensors}
          onDragEnd={onItemDragEnd}
          collisionDetection={collisionDetection}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {section.items.map((item) => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
  }
};

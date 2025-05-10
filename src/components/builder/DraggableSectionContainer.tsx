import { useSectionEditor } from '@/hooks/useSectionEditor';
import type { SectionEditorProps } from '@/types/builderTypes';
import { cn } from '@/utils/styles';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { SectionItemList } from './SectionItemList';

export const DraggableSectionContainer = (props: SectionEditorProps) => {
  const { section, isSelected, onItemSelect, selectedItemId, onItemDelete } = props;

  const {
    // Обработчики
    handleSectionClick,
    handleItemDelete,
    handleItemDragEnd,
    // Стили и параметры
    getSectionStyles,
  } = useSectionEditor(props);

  // Сортировка и DnD - оптимизируем настройки
  const {
    attributes: sortableAttributes,
    listeners: sortableListeners,
    setNodeRef: sortableSetNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section?.id || 'invalid-section',
    data: { type: 'section', section },
  });

  // Проверяем валидность секции
  if (!section || !section.id) {
    return (
      <div className="border-error bg-error-content/10 my-4 rounded border p-4">
        <h3 className="text-error">Помилка: Невалідна секція</h3>
        <p className="text-error text-sm">Необхідно створити нову секцію</p>
      </div>
    );
  }

  const sectionStyles = getSectionStyles();

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={sortableSetNodeRef}
      style={{ ...sortableStyle, ...sectionStyles }}
      className={cn(
        'relative mb-4 border',
        isSelected ? 'border-primary shadow-lg' : 'border-gray-200',
        isDragging ? 'z-50 opacity-70' : ''
      )}
    >
      <div
        className="bg-base-100 sticky top-0 z-10 mb-2 flex items-center justify-between px-4 py-2"
        {...sortableAttributes}
        {...sortableListeners}
        style={{ cursor: 'move' }}
      >
        <div className="flex items-center">
          <div className="mr-2 cursor-move rounded bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-800">
            ⋮⋮
          </div>
          <h3 className="text-lg font-bold">
            {section.settings?.showTitle && section.title
              ? section.title
              : `Секція (${section.type})`}
          </h3>
        </div>
      </div>

      <div className="p-4" onClick={handleSectionClick}>
        {section.items.length > 0 ? (
          <SectionItemList
            section={section}
            onItemSelect={onItemSelect}
            selectedItemId={selectedItemId}
            onItemDragEnd={handleItemDragEnd}
            onItemDelete={onItemDelete ? handleItemDelete : undefined}
          />
        ) : (
          <div className="border-base-300 bg-base-100 rounded-md border border-dashed p-8 text-center">
            <p className="text-base-content">Використовуйте кнопки додавання елементів</p>
          </div>
        )}
      </div>
    </div>
  );
};

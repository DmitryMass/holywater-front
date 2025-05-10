import { type UseItemEditorProps, useItemEditor } from '@hooks/useItemEditor';
import { cn } from '@utils/styles';

import { ButtonItem } from './ButtonItem';
import { CategoryItem } from './CategoryItem';
import { ImageItem } from './ImageItem';
import { ProductItem } from './ProductItem';
import { TextItem } from './TextItem';

// Переиспользуем интерфейс из хука
interface ItemEditorProps extends UseItemEditorProps {
  isSelected: boolean;
}

const ItemEditor = ({ item, isSelected, onClick, onDelete }: ItemEditorProps) => {
  const {
    // Свойства для drag-and-drop
    attributes,
    listeners,
    setNodeRef,
    style,
    // Обработчики
    handleDeleteClick,
    handleClick,
    // Данные
    itemType,
    itemContent,
  } = useItemEditor({ item, onClick, onDelete });

  const renderContent = () => {
    switch (itemType) {
      case 'image':
        return <ImageItem {...itemContent} />;
      case 'text':
        return <TextItem {...itemContent} />;
      case 'button':
        return <ButtonItem title={itemContent.title} />;
      case 'product':
        return <ProductItem {...itemContent} />;
      case 'category':
        return <CategoryItem {...itemContent} />;
      default:
        return <div className="text-base-content p-2 text-center">Невідомий тип елемента</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative cursor-move overflow-hidden rounded border transition-shadow',
        isSelected ? 'border-primary shadow-md' : 'border-base-300'
      )}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {onDelete && (
        <button
          className="btn btn-circle btn-error btn-xs absolute top-2 right-2 z-30 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleDeleteClick}
        >
          ✕
        </button>
      )}

      {renderContent()}
    </div>
  );
};

export default ItemEditor;

import type { ItemType } from '@/types';
import { itemTypeInfo, itemTypes } from '@/utils/consts';

interface ItemPaletteProps {
  onAddItem: (type: ItemType) => void;
  sectionId: string | null;
  className?: string;
}

const ItemPalette = ({ onAddItem, sectionId, className = '' }: ItemPaletteProps) => {
  if (!sectionId) {
    return (
      <div className={`bg-base-200 w-full rounded-lg p-3 sm:p-4 ${className}`}>
        <h3 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">Елементи</h3>
        <div className="bg-base-100 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500 sm:text-sm">Виберіть секцію, щоб додати елементи</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-base-200 w-full rounded-lg p-3 sm:p-4 ${className}`}>
      <h3 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">Елементи для секції</h3>
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {itemTypes.map((type) => (
          <div
            key={type}
            onClick={() => onAddItem(type)}
            className="bg-base-100 hover:bg-opacity-90 cursor-pointer rounded-lg p-2 shadow-sm transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md sm:p-3"
          >
            <div className="flex items-center">
              <div className="bg-primary bg-opacity-10 text-primary mr-2 flex h-8 w-8 items-center justify-center rounded-full text-lg sm:mr-3 sm:h-10 sm:w-10 sm:text-xl">
                {itemTypeInfo[type].icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-primary text-sm font-bold sm:text-base">
                  {itemTypeInfo[type].title}
                </h4>
                <p className="text-primary-content hidden text-xs sm:block sm:text-sm">
                  {itemTypeInfo[type].description}
                </p>
              </div>
              <div className="text-primary ml-1 text-lg font-bold sm:ml-2">+</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-primary bg-opacity-10 mt-3 rounded-lg p-2 sm:mt-4 sm:p-3">
        <p className="text-primary-content text-xs font-medium sm:text-sm">
          <strong>Підказка:</strong> Після додавання елемента, ви можете редагувати його властивості
          в панелі праворуч.
        </p>
      </div>
    </div>
  );
};

export default ItemPalette;

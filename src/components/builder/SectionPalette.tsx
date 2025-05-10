import type { SectionType } from '@/types';
import { sectionTypeInfo, sectionTypes } from '@/utils/consts';

interface SectionPaletteProps {
  onAddSection: (type: SectionType) => void;
  className?: string;
}

const SectionPalette = ({ onAddSection, className = '' }: SectionPaletteProps) => {
  return (
    <div className={`bg-base-200 w-full rounded-lg p-3 sm:p-4 ${className}`}>
      <h3 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">Типи секцій</h3>
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {sectionTypes.map((type) => (
          <div
            key={type}
            className="bg-base-100 border-primary hover:bg-opacity-95 group cursor-pointer rounded-lg border-l-4 p-3 shadow-sm transition-all duration-200 hover:translate-x-1 hover:shadow-md"
            onClick={() => onAddSection(type)}
          >
            <div className="flex items-start">
              <div className="bg-primary bg-opacity-10 text-primary mr-2 flex h-10 w-10 items-center justify-center rounded-full text-xl sm:mr-3 sm:h-12 sm:w-12 sm:text-2xl">
                {sectionTypeInfo[type].icon}
              </div>
              <div className="flex-1">
                <h4 className="text-primary text-sm font-bold sm:text-base">
                  {sectionTypeInfo[type].title}
                </h4>
                <p className="text-primary-content hidden text-xs sm:block sm:text-sm">
                  {sectionTypeInfo[type].description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-primary bg-opacity-10 mt-3 rounded-lg p-2 sm:mt-4 sm:p-3">
        <p className="text-primary-content text-xs font-medium sm:text-sm">
          <strong>Підказка:</strong> Після додавання секції, ви можете додавати до неї елементи та
          налаштовувати її властивості.
        </p>
      </div>
    </div>
  );
};

export default SectionPalette;

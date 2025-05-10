import { cn } from '@utils/styles';

import React from 'react';

// Предопределенные цвета для выбора
const PREDEFINED_COLORS = [
  '#FFFFFF', // белый
  '#F5F5F5', // светло-серый
  '#000000', // черный
  '#FF0000', // красный
  '#00FF00', // зеленый
  '#0000FF', // синий
  '#FFFF00', // желтый
  '#FF00FF', // фиолетовый
  '#00FFFF', // голубой
  '#FFA500', // оранжевый
  '#A52A2A', // коричневый
  '#808080', // серый
  // Добавляем больше цветов для разнообразия
  '#F44336', // Material Red
  '#9C27B0', // Material Purple
  '#3F51B5', // Material Indigo
  '#03A9F4', // Material Light Blue
  '#009688', // Material Teal
  '#4CAF50', // Material Green
  '#FFEB3B', // Material Yellow
  '#FF9800', // Material Orange
  '#795548', // Material Brown
  '#607D8B', // Material Blue Grey
];

// Современные цвета для приложений
const MODERN_COLORS = [
  '#1abc9c', // Turquoise
  '#2ecc71', // Emerald
  '#3498db', // Peter River
  '#9b59b6', // Amethyst
  '#f1c40f', // Sun Flower
  '#e67e22', // Carrot
  '#e74c3c', // Alizarin
  '#ecf0f1', // Clouds
  '#95a5a6', // Concrete
  '#34495e', // Wet Asphalt
];

interface ColorPickerProps {
  name: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (color: string) => void;
}

const ColorPicker = ({
  name,
  label,
  value = '#FFFFFF',
  disabled = false,
  onChange,
}: ColorPickerProps) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handlePredefinedColorClick = (color: string) => {
    if (!disabled) {
      onChange?.(color);
    }
  };

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className="h-10 w-10 rounded border border-gray-300"
            style={{ backgroundColor: value }}
          ></div>
          <input
            id={name}
            type="color"
            name={name}
            value={value}
            disabled={disabled}
            onChange={handleColorChange}
            className={cn(
              'h-8 w-full cursor-pointer',
              disabled ? 'cursor-not-allowed opacity-50' : ''
            )}
          />
        </div>

        <div className="mt-2 mb-1">
          <span className="text-xs text-gray-500">Основні кольори</span>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {PREDEFINED_COLORS.map((color) => (
            <div
              key={color}
              className={cn(
                'aspect-square w-full cursor-pointer rounded-md border border-gray-300 transition-transform hover:scale-110',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                value === color ? 'ring-primary ring-2' : ''
              )}
              style={{ backgroundColor: color }}
              onClick={() => handlePredefinedColorClick(color)}
              title={color}
            />
          ))}
        </div>

        <div className="mt-3 mb-1">
          <span className="text-xs text-gray-500">Сучасні кольори</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {MODERN_COLORS.map((color) => (
            <div
              key={color}
              className={cn(
                'aspect-square w-full cursor-pointer rounded-md border border-gray-300 transition-transform hover:scale-110',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                value === color ? 'ring-primary ring-2' : ''
              )}
              style={{ backgroundColor: color }}
              onClick={() => handlePredefinedColorClick(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;

// Типы для конфигурации экрана
export interface ScreenConfig {
  _id: string;
  id?: string;
  name: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  version: number;
}

// Типы секций
export type SectionType = 'banner' | 'verticalList' | 'horizontalList' | 'grid' | 'hero';

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  items: Item[];
  settings?: SectionSettings;
}

// Типы вариантов расположения элементов в карточке
export type CardLayout = 'vertical' | 'horizontal' | 'horizontal-reverse' | 'overlay';

// Типы элементов
export type ItemType = 'image' | 'text' | 'button' | 'product' | 'category';

export interface Item {
  id: string;
  type: ItemType;
  content: {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    actionUrl?: string;
    description?: string;
    price?: string;
    url?: string;
    link?: string;
    tags?: string[];
    layout?: CardLayout; // Макет карточки для product и image типов
    showButton?: boolean; // Флаг для отображения кнопки "Детали" или "Смотреть"
    buttonText?: string; // Текст кнопки
    [key: string]: string | number | boolean | string[] | undefined; // Для дополнительных свойств
  };
}

// Настройки секций
export interface SectionSettings {
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  showTitle?: boolean;
  gradientColor?: string;
  gradientDirection?: string;
  useGradient?: boolean;
  gridColumns?: string | number;
  [key: string]: string | number | boolean | undefined; // Для дополнительных настроек
}

// Тип для ответа API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

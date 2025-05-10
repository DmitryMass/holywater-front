import type { ItemType, SectionType } from '@/types';

// Стили для тегов
export const tagStyles: Record<string, string> = {
  new: 'bg-success',
  exclusive: 'bg-secondary',
  popular: 'bg-primary',
  trending: 'bg-warning',
  hot: 'bg-error',
  drama: 'bg-warning',
  comedy: 'bg-accent',
};

// Предопределенные теги для My Drama-Web
export const tagStylesMobile: Record<string, string> = {
  new: 'bg-green-500',
  exclusive: 'bg-purple-500',
  popular: 'bg-blue-500',
  trending: 'bg-orange-500',
  hot: 'bg-red-500',
  drama: 'bg-yellow-500',
  comedy: 'bg-pink-500',
};

// Описания элементов
export const itemTypeInfo: Record<ItemType, { title: string; description: string; icon: string }> =
  {
    image: {
      title: 'Зображення',
      description: 'Банер або фото з текстом',
      icon: '🖼️',
    },
    text: {
      title: 'Текст',
      description: 'Текстовий блок з заголовком та описом',
      icon: '📝',
    },
    button: {
      title: 'Кнопка',
      description: 'Кнопка з дією при натисканні',
      icon: '🔘',
    },
    product: {
      title: 'Картка MyDrama',
      description: 'Картка MyDrama із зображенням та ціною',
      icon: '🎬',
    },
    category: {
      title: 'Категорія',
      description: 'Картка категорії із зображенням',
      icon: '📁',
    },
  };

// Все доступные типы элементов
export const itemTypes: ItemType[] = ['image', 'text', 'button', 'product', 'category'];

// Описания секций
export const sectionTypeInfo: Record<
  SectionType,
  { title: string; description: string; icon: string }
> = {
  banner: {
    title: 'Банер',
    description: 'Повноекранний банер із зображенням та текстом',
    icon: '🖼️',
  },
  horizontalList: {
    title: 'Горизонтальний список',
    description: 'Список елементів із горизонтальною прокруткою',
    icon: '↔️',
  },
  verticalList: {
    title: 'Вертикальний список',
    description: 'Список елементів, розташованих вертикально',
    icon: '↕️',
  },
  grid: {
    title: 'Сітка',
    description: 'Елементи, розташовані у вигляді сітки',
    icon: '📱',
  },
  hero: {
    title: 'Секція-герой',
    description: 'Повноекранна секція для особливо важливого контенту',
    icon: '🦸',
  },
};

// Все доступные типы секций
export const sectionTypes: SectionType[] = [
  'banner',
  'horizontalList',
  'verticalList',
  'grid',
  'hero',
];

// Предопределенные теги для My Drama-Web
export const predefinedTags = [
  { id: 'new', label: 'Новинка', color: 'bg-green-500' },
  { id: 'exclusive', label: 'Ексклюзив', color: 'bg-purple-500' },
  { id: 'popular', label: 'Популярне', color: 'bg-blue-500' },
  { id: 'trending', label: 'У тренді', color: 'bg-orange-500' },
  { id: 'hot', label: 'Гаряче', color: 'bg-red-500' },
  { id: 'drama', label: 'Драма', color: 'bg-yellow-500' },
  { id: 'comedy', label: 'Комедія', color: 'bg-pink-500' },
];

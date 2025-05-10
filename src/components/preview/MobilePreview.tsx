import type { Item, ScreenConfig, Section } from '@/types';
import { cn } from '@utils/styles';

import { useEffect } from 'react';

interface MobilePreviewProps {
  config: ScreenConfig | null;
  deviceSize?: 'small' | 'medium' | 'large';
}

// Предопределенные теги для My Drama-Web
const tagStyles: Record<string, string> = {
  new: 'bg-green-500',
  exclusive: 'bg-purple-500',
  popular: 'bg-blue-500',
  trending: 'bg-orange-500',
  hot: 'bg-red-500',
  drama: 'bg-yellow-500',
  comedy: 'bg-pink-500',
};

// Компонент для отображения тегов
const TagsList = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`${tagStyles[tag] || 'bg-gray-500'} rounded-sm px-2 py-0.5 text-xs text-white shadow-sm`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const MobilePreview = ({ config, deviceSize = 'medium' }: MobilePreviewProps) => {
  useEffect(() => {
    if (config && config.sections) {
      config.sections.forEach(() => {});
    }
  }, [config]);

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p>Немає даних для попереднього перегляду</p>
          <p className="mt-2 text-xs">Виберіть конфігурацію екрану або створіть нову</p>
        </div>
      </div>
    );
  }

  // Проверка наличия секций
  if (!config.sections || config.sections.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p>Конфігурація не містить секцій</p>
          <p className="mt-2 text-xs">Додайте секції з палітри ліворуч</p>
        </div>
      </div>
    );
  }

  // Размеры устройства
  const deviceSizeClasses = {
    small: 'w-64', // 256px - компактный телефон
    medium: 'w-80', // 320px - стандартный телефон
    large: 'w-96', // 384px - большой телефон
  };

  // Рендер элемента в зависимости от его типа
  const renderItem = (item: Item) => {
    switch (item.type) {
      case 'image':
        return (
          <div className="relative w-full">
            {item.content.imageUrl ? (
              <img
                src={item.content.imageUrl}
                alt={item.content.title || 'Image'}
                className="h-auto w-full rounded object-cover"
                style={{ maxHeight: '250px' }}
                onError={(e) => {
                  console.error('Image failed to load:', item.content.imageUrl);
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x200?text=Error+Loading+Image';
                }}
              />
            ) : (
              <div className="bg-base-300 flex aspect-video w-full items-center justify-center rounded">
                <span className="text-base-content">Зображення</span>
              </div>
            )}
            <TagsList tags={item.content.tags} />
            {item.content.title && (
              <div className="bg-base-300 bg-opacity-80 text-base-content absolute right-0 bottom-0 left-0 p-2">
                <h4 className="text-sm font-bold">{item.content.title}</h4>
                {item.content.subtitle && <p className="text-xs">{item.content.subtitle}</p>}
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="p-2">
            {item.content.title && (
              <h4 className="text-primary mb-1 text-center font-bold">{item.content.title}</h4>
            )}
            {item.content.description && (
              <p className="text-primary-content text-center text-sm">{item.content.description}</p>
            )}
          </div>
        );

      case 'button':
        return <button className="btn btn-primary w-full">{item.content.title || 'Кнопка'}</button>;

      case 'product': {
        // Выбираем макет для карточки
        const layout = item.content.layout || 'vertical';

        // Компонент кнопки действия
        const actionButton = item.content.showButton && (
          <button className="btn btn-primary btn-sm mt-1 w-full">
            {item.content.buttonText || 'Дивитись'}
          </button>
        );

        // Рендер в зависимости от выбранного макета
        switch (layout) {
          case 'horizontal': // Изображение слева, текст справа
            return (
              <div className="bg-base-200 flex overflow-hidden rounded">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden sm:h-32 sm:w-32">
                  {item.content.imageUrl ? (
                    <img
                      src={item.content.imageUrl}
                      alt={item.content.title || 'MyDrama'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-base-300 flex h-full w-full items-center justify-center">
                      <span className="text-base-content">Серіал</span>
                    </div>
                  )}
                  <TagsList tags={item.content.tags} />
                </div>
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h4 className="text-primary mb-1 text-sm font-bold">
                      {item.content.title || 'Назва серіалу'}
                    </h4>
                    {item.content.price && (
                      <p className="text-primary mb-1 font-semibold">${item.content.price}</p>
                    )}
                    {item.content.subtitle && (
                      <p className="text-primary-content text-xs">{item.content.subtitle}</p>
                    )}
                    {item.content.description && (
                      <p className="text-primary-content mt-1 line-clamp-2 text-xs">
                        {item.content.description}
                      </p>
                    )}
                  </div>
                  {actionButton}
                </div>
              </div>
            );

          case 'horizontal-reverse': // Изображение справа, текст слева
            return (
              <div className="bg-base-200 flex overflow-hidden rounded">
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h4 className="text-primary mb-1 text-sm font-bold">
                      {item.content.title || 'Назва серіалу'}
                    </h4>
                    {item.content.price && (
                      <p className="text-primary mb-1 font-semibold">${item.content.price}</p>
                    )}
                    {item.content.subtitle && (
                      <p className="text-primary-content text-xs">{item.content.subtitle}</p>
                    )}
                    {item.content.description && (
                      <p className="text-primary-content mt-1 line-clamp-2 text-xs">
                        {item.content.description}
                      </p>
                    )}
                  </div>
                  {actionButton}
                </div>
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden sm:h-32 sm:w-32">
                  {item.content.imageUrl ? (
                    <img
                      src={item.content.imageUrl}
                      alt={item.content.title || 'MyDrama'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-base-300 flex h-full w-full items-center justify-center">
                      <span className="text-base-content">Серіал</span>
                    </div>
                  )}
                  <TagsList tags={item.content.tags} />
                </div>
              </div>
            );

          case 'overlay': // Текст поверх изображения
            return (
              <div className="relative overflow-hidden rounded">
                <div className="aspect-video w-full">
                  {item.content.imageUrl ? (
                    <img
                      src={item.content.imageUrl}
                      alt={item.content.title || 'MyDrama'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-base-300 flex h-full w-full items-center justify-center">
                      <span className="text-base-content">Серіал</span>
                    </div>
                  )}
                  <TagsList tags={item.content.tags} />
                </div>
                <div className="bg-base-200 bg-opacity-80 absolute inset-0 flex flex-col justify-end p-3">
                  <h4 className="text-primary mb-1 text-sm font-bold">
                    {item.content.title || 'Назва серіалу'}
                  </h4>
                  {item.content.price && (
                    <p className="text-primary mb-1 font-semibold">${item.content.price}</p>
                  )}
                  {item.content.subtitle && (
                    <p className="text-primary-content text-xs">{item.content.subtitle}</p>
                  )}
                  {actionButton}
                </div>
              </div>
            );

          default: // Вертикальный макет (по умолчанию)
            return (
              <div className="flex flex-col">
                <div className="relative">
                  <div className="aspect-square w-full overflow-hidden rounded-t">
                    {item.content.imageUrl ? (
                      <img
                        src={item.content.imageUrl}
                        alt={item.content.title || 'MyDrama'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-base-300 flex h-full w-full items-center justify-center">
                        <span className="text-base-content">Серіал</span>
                      </div>
                    )}
                    <TagsList tags={item.content.tags} />
                  </div>
                </div>
                <div className="bg-base-200 rounded-b p-2">
                  <h4 className="text-primary text-sm font-bold">
                    {item.content.title || 'Назва серіалу'}
                  </h4>
                  {item.content.price && (
                    <p className="text-primary font-semibold">${item.content.price}</p>
                  )}
                  {item.content.subtitle && (
                    <p className="text-primary-content text-xs">{item.content.subtitle}</p>
                  )}
                  {item.content.description && (
                    <p className="text-primary-content mt-1 line-clamp-2 text-xs">
                      {item.content.description}
                    </p>
                  )}
                  {actionButton}
                </div>
              </div>
            );
        }
      }

      case 'category':
        return (
          <div className="flex flex-col items-center">
            <div className="relative mb-2 h-16 w-16 overflow-hidden">
              <div className="h-16 w-16 rounded-full">
                {item.content.imageUrl ? (
                  <img
                    src={item.content.imageUrl}
                    alt={item.content.title || 'Category'}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-base-300 flex h-full w-full items-center justify-center rounded-full">
                    <span className="text-base-content text-xs">Категорія</span>
                  </div>
                )}
                {item.content.tags && item.content.tags.length > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {item.content.tags.length}
                  </div>
                )}
              </div>
            </div>
            <span className="text-primary text-center text-sm font-medium">
              {item.content.title || 'Категорія'}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  // Рендер секции в зависимости от типа
  const renderSection = (section: Section) => {
    // Добавляем проверку на случай, если section.items undefined
    if (!section.items || !Array.isArray(section.items)) {
      console.error('Section items is not an array:', section);
      return (
        <div key={section.id} className="mb-4 rounded border border-red-500 p-3">
          <p className="text-red-500">Помилка: некоректні дані секції</p>
        </div>
      );
    }

    const sectionStyles: React.CSSProperties = {
      backgroundColor: section.settings?.backgroundColor || 'var(--b1)',
      padding: section.settings?.padding || '15px',
      borderRadius: section.settings?.borderRadius || '8px',
    };

    // Добавляем градиентный фон, если он включен
    if (section.settings?.useGradient && section.settings?.gradientColor) {
      sectionStyles.background = `linear-gradient(${section.settings.gradientDirection || 'to right'}, 
        ${section.settings.backgroundColor || 'var(--b1)'}, 
        ${section.settings.gradientColor})`;
    }

    // Отображаем заголовок секции, если настройка включена
    const renderSectionTitle = () => {
      if (section.settings?.showTitle && section.title) {
        return <h3 className="text-base-content mb-3 text-lg font-bold">{section.title}</h3>;
      }
      return null;
    };

    // Содержимое секции в зависимости от типа
    let sectionContent;
    switch (section.type) {
      case 'banner':
        // Обычно баннер содержит только один элемент
        sectionContent = section.items.length > 0 && renderItem(section.items[0]);
        break;

      case 'horizontalList':
        // Горизонтальный скролл
        sectionContent = (
          <div className="overflow-x-auto">
            <div className="flex gap-3">
              {section.items.map((item) => (
                <div key={item.id} className="max-w-[150px] min-w-[150px]">
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'verticalList':
        // Вертикальный список
        sectionContent = (
          <div className="flex flex-col gap-3">
            {section.items.map((item) => (
              <div key={item.id}>{renderItem(item)}</div>
            ))}
          </div>
        );
        break;

      case 'grid': {
        // Сетка элементов (обычно 2-3 элемента в ряд)
        const gridCols = section.settings?.gridColumns || 2;
        sectionContent = (
          <div
            className={`grid gap-3 ${
              gridCols === '2' || gridCols === 2
                ? 'grid-cols-2'
                : gridCols === '3' || gridCols === 3
                  ? 'grid-cols-3'
                  : gridCols === '4' || gridCols === 4
                    ? 'grid-cols-4'
                    : 'grid-cols-2'
            }`}
          >
            {section.items.map((item) => (
              <div key={item.id}>
                {/* Если это изображение, добавляем дополнительную обертку для оптимизации размера */}
                {item.type === 'image' ? (
                  <div className="relative aspect-square overflow-hidden rounded">
                    {item.content.imageUrl ? (
                      <img
                        src={item.content.imageUrl}
                        alt={item.content.title || 'Image'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/150?text=Error';
                        }}
                      />
                    ) : (
                      <div className="bg-base-300 flex h-full w-full items-center justify-center">
                        <span className="text-base-content text-xs">Зображення</span>
                      </div>
                    )}
                    {/* Теги и заголовок */}
                    {item.content.tags && item.content.tags.length > 0 && (
                      <div className="absolute top-1 left-1 z-10">
                        <div className="flex flex-wrap gap-1">
                          {item.content.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`${tagStyles[tag] || 'bg-gray-500'} rounded px-1 py-0.5 text-[10px] text-white`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {item.content.title && (
                      <div className="bg-base-300 bg-opacity-80 absolute right-0 bottom-0 left-0 p-1">
                        <h5 className="line-clamp-1 text-xs font-medium">{item.content.title}</h5>
                      </div>
                    )}
                  </div>
                ) : (
                  renderItem(item)
                )}
              </div>
            ))}
          </div>
        );
        break;
      }

      case 'hero': {
        // Герой-секция во всю ширину
        sectionContent = (
          <div className="relative -mx-2 -mt-2 mb-4 overflow-hidden rounded-b-lg">
            {section.items.length > 0 ? (
              <div className="relative min-h-[200px]">
                {/* Отображаем все элементы в секции hero, а не только первый */}
                <div className="flex flex-col gap-3 p-2">
                  {section.items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`${
                        item.type === 'image'
                          ? 'relative w-full'
                          : item.type === 'text'
                            ? 'text-center'
                            : ''
                      } ${index === 0 ? 'mt-2' : ''}`}
                    >
                      {renderItem(item)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-base-300 flex min-h-[200px] w-full items-center justify-center">
                <span className="text-base-content">Секція-герой</span>
              </div>
            )}
          </div>
        );
        break;
      }

      default:
        // Универсальный рендерер для любых других типов секций
        sectionContent = (
          <div className="flex flex-col gap-3">
            {section.items.map((item) => (
              <div key={item.id}>{renderItem(item)}</div>
            ))}
          </div>
        );
    }

    return (
      <div key={section.id} className="mb-4 overflow-hidden" style={sectionStyles}>
        {renderSectionTitle()}
        {sectionContent}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col items-center justify-start p-4">
      {/* Фрейм телефона */}
      <div
        className={cn(
          'overflow-hidden rounded-3xl border-8 border-gray-800 shadow-xl',
          deviceSizeClasses[deviceSize],
          'h-[600px]'
        )}
      >
        {/* Статус-бар */}
        <div className="flex justify-between bg-gray-800 px-4 py-1 text-xs text-white">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Содержимое экрана с прокруткой */}
        <div
          className="bg-base-100 h-full overflow-y-auto p-2"
          style={{ WebkitOverflowScrolling: 'touch' }} // Улучшаем скролл на iOS
        >
          {config.sections.map(renderSection)}
        </div>
      </div>

      {/* Выбор размера устройства */}
      <div className="mt-4 flex gap-2">
        <button
          className={cn('btn btn-sm', deviceSize === 'small' ? 'btn-primary' : 'btn-outline')}
          onClick={() =>
            deviceSize !== 'small' &&
            window.dispatchEvent(new CustomEvent('change-device-size', { detail: 'small' }))
          }
        >
          Малий
        </button>
        <button
          className={cn('btn btn-sm', deviceSize === 'medium' ? 'btn-primary' : 'btn-outline')}
          onClick={() =>
            deviceSize !== 'medium' &&
            window.dispatchEvent(new CustomEvent('change-device-size', { detail: 'medium' }))
          }
        >
          Середній
        </button>
        <button
          className={cn('btn btn-sm', deviceSize === 'large' ? 'btn-primary' : 'btn-outline')}
          onClick={() =>
            deviceSize !== 'large' &&
            window.dispatchEvent(new CustomEvent('change-device-size', { detail: 'large' }))
          }
        >
          Великий
        </button>
      </div>
    </div>
  );
};

export default MobilePreview;

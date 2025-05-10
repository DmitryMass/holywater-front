import { TagsList } from './TagsList';

// Компонент для отображения изображения
export const ImageItem = ({
  imageUrl,
  title,
  subtitle,
  tags,
  description,
  layout = 'vertical',
  showButton,
  buttonText,
}: {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  layout?: 'vertical' | 'horizontal' | 'horizontal-reverse' | 'overlay';
  showButton?: boolean;
  buttonText?: string;
}) => {
  // Компонент кнопки действия
  const actionButton = showButton && (
    <button className="btn btn-primary btn-sm mt-1 w-full">{buttonText || 'Детальніше'}</button>
  );

  // Рендер в зависимости от выбранного макета
  switch (layout) {
    case 'horizontal': // Изображение слева, текст справа
      return (
        <div className="bg-base-200 flex overflow-hidden rounded">
          <div className="relative h-32 w-32 flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Image'}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/150x150?text=Помилка';
                }}
              />
            ) : (
              <div className="bg-base-300 flex h-full w-full items-center justify-center">
                <span className="text-base-content text-xs">Зображення</span>
              </div>
            )}
            <TagsList tags={tags} />
          </div>
          <div className="flex flex-1 flex-col justify-between p-3">
            <div>
              <h4 className="text-primary mb-1 text-sm font-bold">{title || 'Заголовок'}</h4>
              {subtitle && <p className="text-primary-content text-xs">{subtitle}</p>}
              {description && (
                <p className="text-primary-content mt-1 line-clamp-2 text-xs">{description}</p>
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
              <h4 className="text-primary mb-1 text-sm font-bold">{title || 'Заголовок'}</h4>
              {subtitle && <p className="text-primary-content text-xs">{subtitle}</p>}
              {description && (
                <p className="text-primary-content mt-1 line-clamp-2 text-xs">{description}</p>
              )}
            </div>
            {actionButton}
          </div>
          <div className="relative h-32 w-32 flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Image'}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/150x150?text=Помилка';
                }}
              />
            ) : (
              <div className="bg-base-300 flex h-full w-full items-center justify-center">
                <span className="text-base-content text-xs">Зображення</span>
              </div>
            )}
            <TagsList tags={tags} />
          </div>
        </div>
      );

    case 'overlay': // Текст поверх изображения
      return (
        <div className="relative overflow-hidden rounded">
          <div className="aspect-video w-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'Image'}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x225?text=Помилка';
                }}
              />
            ) : (
              <div className="bg-base-300 flex h-full w-full items-center justify-center">
                <span className="text-base-content">Зображення</span>
              </div>
            )}
            <TagsList tags={tags} />
          </div>
          <div className="bg-base-200 bg-opacity-80 absolute inset-0 flex flex-col justify-end p-3">
            <h4 className="text-primary mb-1 text-sm font-bold">{title || 'Заголовок'}</h4>
            {subtitle && <p className="text-primary-content text-xs">{subtitle}</p>}
            {actionButton}
          </div>
        </div>
      );

    default: // Вертикальный макет (по умолчанию)
      return (
        <div className="relative">
          {imageUrl ? (
            <div className="aspect-square overflow-hidden rounded">
              <img
                src={imageUrl}
                alt={title || 'Image'}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x400?text=Изображение+недоступно';
                }}
              />
            </div>
          ) : (
            <div className="bg-base-100 flex aspect-square w-full items-center justify-center rounded p-4">
              <span className="text-base-content">Зображення відсутнє</span>
            </div>
          )}
          <TagsList tags={tags} />
          {title && (
            <div className="bg-opacity-50 bg-neutral text-neutral-content absolute right-0 bottom-0 left-0 p-2">
              <h4 className="line-clamp-1 text-sm font-bold">{title || 'Без заголовку'}</h4>
              {subtitle && <p className="line-clamp-1 text-xs">{subtitle}</p>}
            </div>
          )}
          {description && (
            <div className="mt-2">
              <p className="text-primary-content text-xs">{description}</p>
            </div>
          )}
          {actionButton}
        </div>
      );
  }
};

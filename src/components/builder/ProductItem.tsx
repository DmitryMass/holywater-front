import { TagsList } from './TagsList';

// Компонент для отображения карточки MyDrama
export const ProductItem = ({
  imageUrl,
  title,
  price,
  subtitle,
  description,
  tags,
  layout = 'vertical',
  showButton,
  buttonText,
}: {
  imageUrl?: string;
  title?: string;
  price?: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  layout?: 'vertical' | 'horizontal' | 'horizontal-reverse' | 'overlay';
  showButton?: boolean;
  buttonText?: string;
}) => {
  // Компонент кнопки действия
  const actionButton = showButton && (
    <button className="btn btn-primary btn-sm mt-1 w-full">{buttonText || 'Дивитись'}</button>
  );

  // Рендер в зависимости от выбранного макета
  switch (layout) {
    case 'horizontal': // Изображение слева, текст справа
      return (
        <div className="bg-base-200 flex overflow-hidden rounded">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'MyDrama'}
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
                <span className="text-base-content text-xs">Серіал</span>
              </div>
            )}
            <TagsList tags={tags} />
          </div>
          <div className="flex flex-1 flex-col justify-between p-3">
            <div>
              <h4 className="text-primary mb-1 text-sm font-bold">{title || 'Назва серіалу'}</h4>
              {price && <p className="text-primary mb-1 font-semibold">${price}</p>}
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
              <h4 className="text-primary mb-1 text-sm font-bold">{title || 'Назва серіалу'}</h4>
              {price && <p className="text-primary mb-1 font-semibold">${price}</p>}
              {subtitle && <p className="text-primary-content text-xs">{subtitle}</p>}
              {description && (
                <p className="text-primary-content mt-1 line-clamp-2 text-xs">{description}</p>
              )}
            </div>
            {actionButton}
          </div>
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || 'MyDrama'}
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
                <span className="text-base-content text-xs">Серіал</span>
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
                alt={title || 'MyDrama'}
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
                <span className="text-base-content">Серіал</span>
              </div>
            )}
            <TagsList tags={tags} />
          </div>
          <div className="bg-base-200 bg-opacity-80 absolute inset-0 flex flex-col justify-end p-3">
            <h4 className="text-primary mb-1 text-sm font-bold">{title || 'Назва серіалу'}</h4>
            {price && <p className="text-primary mb-1 font-semibold">${price}</p>}
            {subtitle && <p className="text-primary-content text-xs">{subtitle}</p>}
            {actionButton}
          </div>
        </div>
      );

    default: // Вертикальный макет (по умолчанию)
      return (
        <div className="bg-base-100 flex flex-col">
          <div className="relative">
            <div className="aspect-square w-full overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title || 'MyDrama'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load image:', imageUrl);
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x400?text=Изображение+недоступно';
                  }}
                />
              ) : (
                <div className="bg-base-200 flex h-full w-full items-center justify-center">
                  <span className="text-base-content">Карточка MyDrama</span>
                </div>
              )}
              <TagsList tags={tags} />
            </div>
          </div>
          <div className="p-2">
            <h4 className="text-primary line-clamp-1 text-sm font-bold">
              {title || 'Назва MyDrama'}
            </h4>
            {price ? (
              <p className="text-primary font-semibold">${price}</p>
            ) : (
              <p className="text-primary font-semibold">$5.00</p>
            )}
            {subtitle ? (
              <p className="text-base-content line-clamp-2 text-xs">{subtitle}</p>
            ) : (
              <p className="text-base-content text-xs">Опис MyDrama</p>
            )}
            {description && (
              <p className="text-primary-content mt-1 line-clamp-2 text-xs">{description}</p>
            )}
            {actionButton}
          </div>
        </div>
      );
  }
};

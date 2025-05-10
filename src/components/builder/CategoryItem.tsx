// Компонент для отображения категории
export const CategoryItem = ({
  imageUrl,
  title,
  tags,
}: {
  imageUrl?: string;
  title?: string;
  tags?: string[];
}) => (
  <div className="bg-base-100 relative flex flex-col items-center p-4">
    <div className="relative mb-2 h-16 w-16 overflow-hidden">
      <div className="h-16 w-16 rounded-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || 'Category'}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
            onError={(e) => {
              console.error('Failed to load image:', imageUrl);
              (e.target as HTMLImageElement).src =
                'https://via.placeholder.com/150x150?text=Помилка';
            }}
          />
        ) : (
          <div className="bg-base-200 flex h-full w-full items-center justify-center rounded-full">
            <span className="text-base-content text-xs">Немає фото</span>
          </div>
        )}
      </div>
      {tags && tags.length > 0 && (
        <div className="bg-error text-error-content absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs">
          {tags.length}
        </div>
      )}
    </div>
    <span className="text-primary line-clamp-2 max-w-full text-center text-sm font-medium break-words">
      {title || 'Категорія'}
    </span>
  </div>
);

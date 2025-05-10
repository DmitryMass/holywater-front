import { tagStyles } from '@/utils/consts';

// Компонент для отображения тегов
export const TagsList = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`${tagStyles[tag] || 'bg-neutral'} text-base-100 rounded-sm px-2 py-0.5 text-xs shadow-sm`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

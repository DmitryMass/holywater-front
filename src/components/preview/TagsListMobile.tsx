import { tagStylesMobile } from '@/utils/consts';

// Компонент для отображения тегов
export const TagsListMobile = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`${tagStylesMobile[tag] || 'bg-gray-500'} rounded-sm px-2 py-0.5 text-xs text-white shadow-sm`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

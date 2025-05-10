// Компонент для отображения текста
export const TextItem = ({ title, description }: { title?: string; description?: string }) => (
  <div className="bg-base-100 p-2">
    {title ? (
      <h4 className="text-primary mb-1 font-bold">{title}</h4>
    ) : (
      <h4 className="text-primary mb-1 font-bold">Заголовок для текстового блоку</h4>
    )}
    {description ? (
      <p className="text-base-content text-sm">{description}</p>
    ) : (
      <p className="text-base-content text-sm">
        Це заглушка для текстового блока. Додайте сюди ваш текст.
      </p>
    )}
  </div>
);

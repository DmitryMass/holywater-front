// Компонент для отображения кнопки
export const ButtonItem = ({ title }: { title?: string }) => (
  <button className="btn btn-primary w-full">{title || 'Кнопка без тексту'}</button>
);

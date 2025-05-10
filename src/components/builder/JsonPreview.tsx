import Button from '@components/ui/Button';

import { useState } from 'react';

interface JsonPreviewProps {
  data: Record<string, unknown>;
  className?: string;
}

const JsonPreview = ({ data, className = '' }: JsonPreviewProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Форматированный JSON
  const formattedJson = JSON.stringify(data, null, 2);

  // Копирование в буфер обмена
  const handleCopy = () => {
    if (!data) {
      return; // Не копируем пустые данные
    }

    navigator.clipboard.writeText(formattedJson).then(
      () => {
        setIsCopied(true);
        // Сбрасываем состояние через 2 секунды
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      },
      (err) => {
        console.error('Не удалось скопировать текст: ', err);
      }
    );
  };

  // Переключение развернутого/свернутого состояния
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Отображаемое содержимое
  const renderContent = () => {
    if (!data || formattedJson === 'null') {
      return (
        <div className="flex h-[200px] items-center justify-center text-gray-500">
          <p>Немає даних для відображення</p>
        </div>
      );
    }

    return (
      <pre className="bg-base-100 rounded p-4 text-xs break-words whitespace-pre-wrap sm:text-sm">
        {formattedJson}
      </pre>
    );
  };

  return (
    <div className={`bg-base-200 w-full rounded-lg ${className}`}>
      <div className="border-base-300 flex flex-wrap items-center justify-between gap-2 border-b p-3 sm:p-4">
        <h3 className="text-base font-bold sm:text-lg">JSON Попередній перегляд</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpanded}
            className="hidden sm:inline-flex"
          >
            {isExpanded ? 'Згорнути' : 'Розгорнути'}
          </Button>
          <Button
            variant={isCopied ? 'primary' : 'outline'}
            size="sm"
            onClick={handleCopy}
            disabled={!data || formattedJson === 'null'}
          >
            {isCopied ? 'Скопійовано!' : 'Копіювати'}
          </Button>
        </div>
      </div>
      <div
        className={`overflow-auto p-2 sm:p-4 ${
          isExpanded ? 'max-h-[800px]' : 'max-h-[300px] sm:max-h-[400px]'
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default JsonPreview;

import type { CardLayout, Item, Section } from '@/types';
import { predefinedTags } from '@/utils/consts';
import Button from '@components/ui/Button';
import ColorPicker from '@components/ui/ColorPicker';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import { toast } from 'sonner';

interface PropertyPanelProps {
  selectedSection: Section | null;
  selectedItem: Item | null;
  onSectionChange: (section: Section) => void;
  onItemChange: (sectionId: string, itemId: string, updates: Partial<Item>) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  className?: string;
}

const PropertyPanel = ({
  selectedSection,
  selectedItem,
  onSectionChange,
  onItemChange,
  onDeleteItem,
  onDeleteSection,
  className = '',
}: PropertyPanelProps) => {
  // Если ничего не выбрано
  if (!selectedSection) {
    return (
      <div className={`bg-base-200 w-full rounded-lg p-3 sm:p-4 ${className}`}>
        <h3 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">Властивості</h3>
        <div className="bg-base-100 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500 sm:text-sm">
            Виберіть секцію або елемент для редагування
          </p>
        </div>
      </div>
    );
  }

  // Если выбран элемент, отображаем его свойства
  if (selectedItem) {
    return (
      <div className={`bg-base-200 w-full rounded-lg p-3 sm:p-4 ${className}`}>
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h3 className="text-base font-bold sm:text-lg">Властивості елемента</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.custom(
                (t) => (
                  <div className="bg-base-100 max-w-md rounded-lg border p-6 shadow-lg">
                    <h3 className="mb-4 text-lg font-bold">Видалити елемент?</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Ви дійсно хочете видалити цей елемент?
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)}>
                        Скасувати
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          onDeleteItem(selectedSection.id, selectedItem.id);
                          toast.dismiss(t);
                          toast.success('Елемент видалено');
                        }}
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                ),
                { duration: 10000 }
              );
            }}
          >
            Видалити
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 font-semibold">Тип: {selectedItem.type}</p>
          </div>

          {/* Общие свойства для всех типов элементов */}
          <Input
            name="title"
            label="Заголовок"
            value={selectedItem.content.title || ''}
            onChange={(e) =>
              onItemChange(selectedSection.id, selectedItem.id, {
                content: { ...selectedItem.content, title: e.target.value },
              })
            }
          />

          {/* Свойства в зависимости от типа элемента */}
          {(selectedItem.type === 'image' ||
            selectedItem.type === 'product' ||
            selectedItem.type === 'category') && (
            <>
              <Input
                name="imageUrl"
                label="URL зображення"
                value={selectedItem.content.imageUrl || ''}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, imageUrl: e.target.value },
                  })
                }
              />
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Використовуйте URL зображення або заглушку
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onItemChange(selectedSection.id, selectedItem.id, {
                      content: {
                        ...selectedItem.content,
                        imageUrl:
                          'https://images.pexels.com/photos/7809122/pexels-photo-7809122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                      },
                    })
                  }
                >
                  Вставити заглушку
                </Button>
              </div>
            </>
          )}

          {(selectedItem.type === 'image' || selectedItem.type === 'product') && (
            <>
              <Input
                name="subtitle"
                label="Підзаголовок"
                value={selectedItem.content.subtitle || ''}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, subtitle: e.target.value },
                  })
                }
              />

              <Input
                name="description"
                label="Опис"
                value={selectedItem.content.description || ''}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, description: e.target.value },
                  })
                }
              />

              <Input
                name="url"
                label="Внутрішній URL"
                placeholder="Наприклад: /show/123"
                value={selectedItem.content.url || ''}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, url: e.target.value },
                  })
                }
              />

              <Input
                name="link"
                label="Зовнішнє посилання"
                placeholder="Повне посилання, наприклад: https://example.com"
                value={selectedItem.content.link || ''}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, link: e.target.value },
                  })
                }
              />

              <Select
                name="layout"
                label="Макет карточки"
                options={[
                  { value: 'vertical', label: 'Вертикальний (зображення зверху)' },
                  { value: 'horizontal', label: 'Горизонтальний (зображення зліва)' },
                  { value: 'horizontal-reverse', label: 'Горизонтальний (зображення справа)' },
                  { value: 'overlay', label: 'Накладення (текст поверх зображення)' },
                ]}
                value={selectedItem.content.layout || 'vertical'}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, layout: e.target.value as CardLayout },
                  })
                }
              />

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Показувати кнопку дії</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={selectedItem.content.showButton || false}
                    onChange={(e) =>
                      onItemChange(selectedSection.id, selectedItem.id, {
                        content: { ...selectedItem.content, showButton: e.target.checked },
                      })
                    }
                  />
                </label>
              </div>

              {selectedItem.content.showButton && (
                <Input
                  name="buttonText"
                  label="Текст кнопки"
                  value={
                    selectedItem.content.buttonText ||
                    (selectedItem.type === 'image' ? 'Детальніше' : 'Дивитись')
                  }
                  onChange={(e) =>
                    onItemChange(selectedSection.id, selectedItem.id, {
                      content: { ...selectedItem.content, buttonText: e.target.value },
                    })
                  }
                />
              )}

              {/* Управление тегами */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Теги</span>
                </label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {selectedItem.content.tags?.map((tagId) => {
                    const tag = predefinedTags.find((t) => t.id === tagId);
                    return (
                      <div
                        key={tagId}
                        className={`${tag?.color || 'bg-gray-500'} flex items-center rounded-full px-2 py-1 text-xs text-white`}
                      >
                        {tag?.label || tagId}
                        <button
                          className="ml-1 hover:text-red-200"
                          onClick={() => {
                            const updatedTags = (selectedItem.content.tags || []).filter(
                              (t) => t !== tagId
                            );
                            onItemChange(selectedSection.id, selectedItem.id, {
                              content: { ...selectedItem.content, tags: updatedTags },
                            });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {predefinedTags.map((tag) => {
                    const isSelected = selectedItem.content.tags?.includes(tag.id);
                    if (isSelected) return null;

                    return (
                      <button
                        key={tag.id}
                        className={`${tag.color} rounded-full px-2 py-1 text-xs text-white opacity-80 hover:opacity-100`}
                        onClick={() => {
                          const currentTags = selectedItem.content.tags || [];
                          onItemChange(selectedSection.id, selectedItem.id, {
                            content: {
                              ...selectedItem.content,
                              tags: [...currentTags, tag.id],
                            },
                          });
                        }}
                      >
                        + {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {selectedItem.type === 'text' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Опис</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={4}
                value={selectedItem.content.description || ''}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, description: e.target.value },
                  })
                }
              />
            </div>
          )}

          {selectedItem.type === 'product' && (
            <>
              <Input
                name="price"
                label="Ціна ($)"
                value={selectedItem.content.price || ''}
                onChange={(e) =>
                  onItemChange(selectedSection.id, selectedItem.id, {
                    content: { ...selectedItem.content, price: e.target.value },
                  })
                }
              />
            </>
          )}

          {/* Свойство URL действия для всех типов */}
          <Input
            name="actionUrl"
            label="Action URL"
            placeholder="app://action-name"
            value={selectedItem.content.actionUrl || ''}
            onChange={(e) =>
              onItemChange(selectedSection.id, selectedItem.id, {
                content: { ...selectedItem.content, actionUrl: e.target.value },
              })
            }
          />
        </div>
      </div>
    );
  }

  // Если выбрана секция, отображаем её свойства
  return (
    <div className={`bg-base-200 w-full rounded-lg p-3 sm:p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h3 className="text-base font-bold sm:text-lg">Властивості секції</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast.custom(
              (t) => (
                <div className="bg-base-100 max-w-md rounded-lg border p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-bold">Видалити секцію?</h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Ви дійсно хочете видалити секцію і всі її елементи?
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)}>
                      Скасувати
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        onDeleteSection(selectedSection.id);
                        toast.dismiss(t);
                        toast.success('Секція видалена');
                      }}
                    >
                      Видалити
                    </Button>
                  </div>
                </div>
              ),
              { duration: 10000 }
            );
          }}
        >
          Видалити
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 font-semibold">Тип: {selectedSection.type}</p>
        </div>

        <Input
          name="title"
          label="Заголовок секції"
          value={selectedSection.title || ''}
          onChange={(e) =>
            onSectionChange({
              ...selectedSection,
              title: e.target.value,
            })
          }
        />

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Показувати заголовок</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={selectedSection.settings?.showTitle || false}
              onChange={(e) =>
                onSectionChange({
                  ...selectedSection,
                  settings: {
                    ...selectedSection.settings,
                    showTitle: e.target.checked,
                  },
                })
              }
            />
          </label>
        </div>

        <ColorPicker
          name="backgroundColor"
          label="Колір фону"
          value={selectedSection.settings?.backgroundColor || '#ffffff'}
          onChange={(color) =>
            onSectionChange({
              ...selectedSection,
              settings: {
                ...selectedSection.settings,
                backgroundColor: color,
              },
            })
          }
        />

        {/* Настройки для градиентного фона */}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Використовувати градієнт</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={selectedSection.settings?.useGradient || false}
              onChange={(e) =>
                onSectionChange({
                  ...selectedSection,
                  settings: {
                    ...selectedSection.settings,
                    useGradient: e.target.checked,
                  },
                })
              }
            />
          </label>
        </div>

        {selectedSection.settings?.useGradient && (
          <>
            <ColorPicker
              name="gradientColor"
              label="Другий колір для градієнта"
              value={selectedSection.settings?.gradientColor || '#f5f5f5'}
              onChange={(color) =>
                onSectionChange({
                  ...selectedSection,
                  settings: {
                    ...selectedSection.settings,
                    gradientColor: color,
                  },
                })
              }
            />
            <Select
              name="gradientDirection"
              label="Напрямок градієнта"
              options={[
                { value: 'to right', label: 'Зліва направо' },
                { value: 'to left', label: 'Справа наліво' },
                { value: 'to bottom', label: 'Зверху вниз' },
                { value: 'to top', label: 'Знизу вверх' },
                { value: 'to bottom right', label: 'По діагоналі (↘)' },
                { value: 'to bottom left', label: 'По діагоналі (↙)' },
                { value: 'to top right', label: 'По діагоналі (↗)' },
                { value: 'to top left', label: 'По діагоналі (↖)' },
              ]}
              value={selectedSection.settings?.gradientDirection || 'to right'}
              onChange={(e) =>
                onSectionChange({
                  ...selectedSection,
                  settings: {
                    ...selectedSection.settings,
                    gradientDirection: e.target.value,
                  },
                })
              }
            />
          </>
        )}

        <Select
          name="padding"
          label="Відступи"
          options={[
            { value: '5px', label: 'Маленькі (5px)' },
            { value: '10px', label: 'Середні (10px)' },
            { value: '15px', label: 'Великі (15px)' },
            { value: '20px', label: 'Дуже великі (20px)' },
          ]}
          value={selectedSection.settings?.padding || '15px'}
          onChange={(e) =>
            onSectionChange({
              ...selectedSection,
              settings: {
                ...selectedSection.settings,
                padding: e.target.value,
              },
            })
          }
        />

        <Select
          name="borderRadius"
          label="Заокруглення кутів"
          options={[
            { value: '0px', label: 'Ні' },
            { value: '4px', label: 'Маленьке (4px)' },
            { value: '8px', label: 'Середнє (8px)' },
            { value: '12px', label: 'Велике (12px)' },
            { value: '16px', label: 'Дуже велике (16px)' },
          ]}
          value={selectedSection.settings?.borderRadius || '8px'}
          onChange={(e) =>
            onSectionChange({
              ...selectedSection,
              settings: {
                ...selectedSection.settings,
                borderRadius: e.target.value,
              },
            })
          }
        />

        {/* Настройки для сітки */}
        {selectedSection.type === 'grid' && (
          <Select
            name="gridColumns"
            label="Кількість колонок у сітці"
            options={[
              { value: '2', label: '2 колонки' },
              { value: '3', label: '3 колонки' },
              { value: '4', label: '4 колонки' },
            ]}
            value={selectedSection.settings?.gridColumns || '2'}
            onChange={(e) =>
              onSectionChange({
                ...selectedSection,
                settings: {
                  ...selectedSection.settings,
                  gridColumns: e.target.value,
                },
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;

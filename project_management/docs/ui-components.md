# UI компоненты для билдера главного экрана

## Обзор

В этом документе описаны основные UI компоненты, которые будут использоваться в билдере главного экрана мобильного приложения. UI компоненты разделены на следующие категории:

1. Базовые UI компоненты
2. Компоненты билдера
3. Компоненты превью

## Базовые UI компоненты

### Button

Базовый компонент кнопки с различными вариантами стилизации.

```tsx
// Компонент: Button
// Путь: src/components/ui/Button.tsx

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}
```

### Input

Текстовое поле ввода с возможностью интеграции с React Hook Form.

```tsx
// Компонент: Input
// Путь: src/components/ui/Input.tsx

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  register?: any; // Для React Hook Form
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### Select

Компонент выпадающего списка.

```tsx
// Компонент: Select
// Путь: src/components/ui/Select.tsx

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  register?: any; // Для React Hook Form
  onChange?: (value: string) => void;
}
```

### ColorPicker

Компонент для выбора цвета.

```tsx
// Компонент: ColorPicker
// Путь: src/components/ui/ColorPicker.tsx

interface ColorPickerProps {
  name: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (color: string) => void;
}
```

### Modal

Модальное окно для различных диалогов.

```tsx
// Компонент: Modal
// Путь: src/components/ui/Modal.tsx

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnClickOutside?: boolean;
}
```

### Tabs

Компонент для переключения между вкладками.

```tsx
// Компонент: Tabs
// Путь: src/components/ui/Tabs.tsx

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}
```

## Компоненты билдера

### BuilderLayout

Основной компонент разметки для страницы билдера.

```tsx
// Компонент: BuilderLayout
// Путь: src/components/builder/BuilderLayout.tsx

interface BuilderLayoutProps {
  toolbar: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
  propertyPanel: React.ReactNode;
}
```

### BuilderToolbar

Верхняя панель инструментов для управления конфигурациями.

```tsx
// Компонент: BuilderToolbar
// Путь: src/components/builder/BuilderToolbar.tsx

interface BuilderToolbarProps {
  configName: string;
  onSave: () => void;
  onNew: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onConfigNameChange: (name: string) => void;
  onExportJson: () => void;
}
```

### SectionPalette

Палитра доступных типов секций.

```tsx
// Компонент: SectionPalette
// Путь: src/components/builder/SectionPalette.tsx

interface SectionPaletteProps {
  onSectionDragStart: (sectionType: string) => void;
}
```

### ItemPalette

Палитра доступных типов элементов.

```tsx
// Компонент: ItemPalette
// Путь: src/components/builder/ItemPalette.tsx

interface ItemPaletteProps {
  onItemDragStart: (itemType: string) => void;
}
```

### DropZone

Зона, в которую можно перетаскивать элементы.

```tsx
// Компонент: DropZone
// Путь: src/components/builder/DropZone.tsx

interface DropZoneProps {
  onDrop: (item: any) => void;
  accept: string[];
  isHighlighted?: boolean;
  children?: React.ReactNode;
  className?: string;
}
```

### SectionEditor

Компонент для редактирования секции.

```tsx
// Компонент: SectionEditor
// Путь: src/components/builder/SectionEditor.tsx

interface SectionEditorProps {
  section: Section;
  onSectionChange: (section: Section) => void;
  onSectionDelete: (sectionId: string) => void;
  onSectionMove: (sectionId: string, direction: 'up' | 'down') => void;
  onItemDrop: (sectionId: string, item: any) => void;
}
```

### ItemEditor

Компонент для редактирования элемента.

```tsx
// Компонент: ItemEditor
// Путь: src/components/builder/ItemEditor.tsx

interface ItemEditorProps {
  item: Item;
  onItemChange: (item: Item) => void;
  onItemDelete: (itemId: string) => void;
  onItemMove: (itemId: string, direction: 'up' | 'down' | 'left' | 'right') => void;
}
```

### PropertyPanel

Панель свойств для редактирования выбранного элемента или секции.

```tsx
// Компонент: PropertyPanel
// Путь: src/components/builder/PropertyPanel.tsx

interface PropertyPanelProps {
  selectedItem?: Item | Section;
  onItemChange?: (item: Item) => void;
  onSectionChange?: (section: Section) => void;
}
```

### JsonPreview

Компонент для предпросмотра сгенерированного JSON.

```tsx
// Компонент: JsonPreview
// Путь: src/components/builder/JsonPreview.tsx

interface JsonPreviewProps {
  data: any;
  onCopy: () => void;
}
```

## Компоненты превью

### MobilePreview

Компонент для визуализации того, как конфигурация будет выглядеть в мобильном приложении.

```tsx
// Компонент: MobilePreview
// Путь: src/components/preview/MobilePreview.tsx

interface MobilePreviewProps {
  config: ScreenConfig;
  deviceSize?: 'small' | 'medium' | 'large';
}
```

### BannerPreview

Компонент для предпросмотра баннера.

```tsx
// Компонент: BannerPreview
// Путь: src/components/preview/BannerPreview.tsx

interface BannerPreviewProps {
  banner: Section;
}
```

### HorizontalListPreview

Компонент для предпросмотра горизонтального списка.

```tsx
// Компонент: HorizontalListPreview
// Путь: src/components/preview/HorizontalListPreview.tsx

interface HorizontalListPreviewProps {
  list: Section;
}
```

### VerticalListPreview

Компонент для предпросмотра вертикального списка.

```tsx
// Компонент: VerticalListPreview
// Путь: src/components/preview/VerticalListPreview.tsx

interface VerticalListPreviewProps {
  list: Section;
}
```

### TabsPreview

Компонент для предпросмотра вкладок.

```tsx
// Компонент: TabsPreview
// Путь: src/components/preview/TabsPreview.tsx

interface TabsPreviewProps {
  tabs: Section;
}
```

### GridPreview

Компонент для предпросмотра сетки.

```tsx
// Компонент: GridPreview
// Путь: src/components/preview/GridPreview.tsx

interface GridPreviewProps {
  grid: Section;
}
```

## Стилизация компонентов

Все компоненты будут стилизованы с использованием TailwindCSS и DaisyUI. Для улучшения переиспользуемости и консистентности стилей мы будем использовать подход с объединением классов через tailwind-merge.

### Пример использования tailwind-merge

```tsx
// src/utils/styles.ts
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: string[]) => {
  return twMerge(classes);
};
```

```tsx
// Пример использования в компоненте
import { cn } from '../../utils/styles';

const Button = ({ className, variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-focus',
    secondary: 'bg-secondary text-white hover:bg-secondary-focus',
    // ...другие варианты
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
};
```

## Реализация drag-and-drop

Для реализации функционала drag-and-drop мы будем использовать библиотеку @dnd-kit/core. Ниже приведен пример реализации для перетаскивания секций:

```tsx
// Пример использования drag-and-drop для секций
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

const DraggableSection = ({ section, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} {...props}>
      {/* Содержимое секции */}
    </div>
  );
};

const SectionsList = ({ sections, onSectionsChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Изменяем порядок секций
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = [...sections];
      const [removed] = newSections.splice(oldIndex, 1);
      newSections.splice(newIndex, 0, removed);

      onSectionsChange(newSections);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <DraggableSection key={section.id} section={section} />
        ))}
      </SortableContext>
    </DndContext>
  );
};
```

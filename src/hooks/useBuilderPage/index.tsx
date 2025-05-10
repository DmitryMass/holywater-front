import type { ItemType, ScreenConfig, Section, SectionType } from '@/types';
import Button from '@components/ui/Button';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useScreenConfigApi } from '@hooks/useApi/useScreenConfigApi';
import { useScreenConfig } from '@hooks/useScreenConfig/useScreenConfig';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import { useEffect, useState } from 'react';

import * as screenConfigApi from '../../services/api/screenConfigApi';

export const useBuilderPage = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [deviceSize, setDeviceSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [activeId, setActiveId] = useState<string | null>(null);

  // Хук для работы с API
  const {
    configs,
    currentConfig,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
    loading,
  } = useScreenConfigApi();

  // Безопасные функции для работы с API напрямую
  const fetchActiveConfig = async () => {
    try {
      const response = await screenConfigApi.getActiveScreenConfig();
      if (response.success && response.data) {
        // Адаптируем ответ API для работы с хуком
        const activeConfig = {
          ...response.data,
          id: response.data._id,
        } as unknown as ScreenConfig;
        return activeConfig;
      }
      toast.error('Активна конфігурація не знайдена');
      return null;
    } catch {
      toast.error('Помилка при завантаженні активної конфігурації');
      return null;
    }
  };

  const activateConfig = async (id: string) => {
    try {
      const response = await screenConfigApi.activateScreenConfig(id);
      if (response.success) {
        // Обновляем список всех конфигураций
        await fetchConfigs();
        return true;
      }
      toast.error('Не вдалося активувати конфігурацію');
      return false;
    } catch {
      toast.error('Помилка при активації конфігурації');
      return false;
    }
  };

  // Хук для управления конфигурацией
  const {
    config,
    setConfig,
    addSection,
    updateSection,
    deleteSection,
    moveSection,
    addItem,
    updateItem,
    deleteItem,
    selectedSectionId,
    selectedItemId,
    selectedSection,
    selectedItem,
    selectSection,
    selectItem,
  } = useScreenConfig(currentConfig);

  // Загружаем конфигурации при монтировании
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  // Проверка и восстановление ID секций
  const validateAndFixConfig = (config: ScreenConfig | null): ScreenConfig | null => {
    if (!config) {
      return null;
    }

    // Создаем копию конфигурации для изменений
    const fixedConfig = { ...config };

    // Убедимся, что все базовые поля существуют
    fixedConfig._id = fixedConfig._id || '';
    fixedConfig.name = fixedConfig.name || 'Нова конфігурація';
    fixedConfig.createdAt = fixedConfig.createdAt || new Date().toISOString();
    fixedConfig.updatedAt = fixedConfig.updatedAt || new Date().toISOString();
    fixedConfig.isActive = !!fixedConfig.isActive;
    fixedConfig.version = fixedConfig.version || 1;

    // Убедимся, что секции существуют
    if (!fixedConfig.sections || !Array.isArray(fixedConfig.sections)) {
      fixedConfig.sections = [];
      return fixedConfig;
    }

    // Проверяем и исправляем ID секций
    const fixedSections = fixedConfig.sections.map((section) => {
      if (!section || typeof section !== 'object') {
        return {
          id: uuidv4(),
          type: 'banner' as SectionType,
          title: 'Нова секція',
          items: [],
          settings: {
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '8px',
            showTitle: true,
          },
        };
      }

      // Если у секции нет ID, генерируем новый
      const fixedSection: Section = {
        ...section,
        id: section.id || uuidv4(),
        type: section.type || 'banner',
        title: section.title || 'Секція без назви',
        items: [],
        settings: section.settings || {
          backgroundColor: '#ffffff',
          padding: '15px',
          borderRadius: '8px',
          showTitle: true,
        },
      };

      // Проверяем и исправляем ID элементов
      if (!section.items || !Array.isArray(section.items)) {
        fixedSection.items = [];
      } else {
        fixedSection.items = section.items
          .filter((item) => item !== null && typeof item === 'object') // Фильтруем невалидные элементы
          .map((item) => {
            if (!item || typeof item !== 'object') {
              return {
                id: uuidv4(),
                type: 'text' as ItemType,
                content: {
                  title: 'Новий елемент',
                },
              };
            }

            return {
              id: item.id || uuidv4(),
              type: item.type || 'text',
              content: item.content || { title: 'Елемент без контенту' },
            };
          });
      }

      return fixedSection;
    });

    return {
      ...fixedConfig,
      sections: fixedSections,
    };
  };

  // Обработка выбора размера устройства в превью
  useEffect(() => {
    const handleChangeDeviceSize = (e: Event) => {
      if (e instanceof CustomEvent) {
        setDeviceSize(e.detail as 'small' | 'medium' | 'large');
      }
    };

    window.addEventListener('change-device-size', handleChangeDeviceSize as EventListener);
    return () => {
      window.removeEventListener('change-device-size', handleChangeDeviceSize as EventListener);
    };
  }, []);

  // Обработчики drag-and-drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !config) return;

    // Проверяем корректность ID
    if (typeof active.id !== 'string' || typeof over.id !== 'string') return;

    // Перетаскивание имеет смысл только если элементы различны
    if (active.id === over.id) return;

    const oldIndex = config.sections.findIndex((section) => section.id === active.id);
    const newIndex = config.sections.findIndex((section) => section.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Используем функцию arrayMove для изменения порядка секций
      const updatedSections = arrayMove(config.sections, oldIndex, newIndex);

      // Обновляем конфигурацию с новым порядком секций
      setConfig({
        ...config,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      });

      // Уведомляем пользователя о перемещении
      toast.success(
        `Секція "${
          config.sections[oldIndex]?.title || 'без назви'
        }" переміщена ${newIndex > oldIndex ? 'вниз' : 'вверх'}`
      );
    }
  };

  // Загрузка существующей конфигурации
  const handleLoadConfig = async (configId: string) => {
    try {
      const response = await screenConfigApi.getScreenConfigById(configId);

      if (response.success && response.data) {
        // Адаптируем ответ API для работы с хуком
        const loadedConfig = {
          ...response.data,
          id: response.data._id,
        } as unknown as ScreenConfig;

        // Проверяем и исправляем ID секций и элементов
        const fixedConfig = validateAndFixConfig(loadedConfig);

        if (fixedConfig) {
          setConfig(fixedConfig);
          // Сбрасываем выбранные элементы при загрузке новой конфигурации
          selectSection(null);
          toast.success(`Конфігурація "${fixedConfig.name}" завантажена`);
        } else {
          toast.error('Не вдалося обробити конфігурацію');
        }
      } else {
        toast.error('Не вдалося завантажити конфігурацію');
      }
    } catch {
      toast.error('Помилка при завантаженні конфігурації');
    }
  };

  // Загрузка активной конфигурации
  const handleLoadActiveConfig = async () => {
    try {
      const activeConfig = await fetchActiveConfig();
      if (activeConfig) {
        // Проверяем и исправляем ID секций и элементов
        const fixedConfig = validateAndFixConfig(activeConfig);

        if (fixedConfig) {
          setConfig(fixedConfig);
          // Сбрасываем выбранные элементы при загрузке новой конфигурации
          selectSection(null);
          toast.success(`Активна конфігурація "${fixedConfig.name}" завантажена`);
        } else {
          toast.error('Не вдалося обробити активну конфігурацію');
        }
      } else {
        toast.error('Активна конфігурація не знайдена');
      }
    } catch {
      toast.error('Помилка при завантаженні активної конфігурації');
    }
  };

  // Активация конфигурации
  const handleActivateConfig = async () => {
    if (!config || !config._id) {
      toast.error('Нет активної конфігурації для активації');
      return;
    }

    try {
      const success = await activateConfig(config._id);
      if (success) {
        toast.success(`Конфігурація "${config.name}" успішно активована!`);
        // Обновляем состояние текущей конфигурации
        setConfig({
          ...config,
          isActive: true,
        });
        // Обновляем список конфигураций
        await fetchConfigs();
      } else {
        toast.error('Не вдалося активувати конфігурацію');
      }
    } catch {
      toast.error('Помилка при активації конфігурації');
    }
  };

  // Сохранение конфигурации
  const handleSaveConfig = async () => {
    if (!config) {
      toast.error('Нет конфігурації для збереження');
      return;
    }

    // Проверяем наличие секций
    if (config.sections.length === 0) {
      toast.custom(
        (t) => (
          <div className="bg-base-100 max-w-md rounded-lg border p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">Зберегти пустую конфігурацію?</h3>
            <p className="mb-4 text-sm text-gray-600">
              Ви намагаєтеся зберегти конфігурацію без секцій. Це може привести до пустого екрана в
              застосунку.
            </p>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)}>
                Отмена
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={async () => {
                  toast.dismiss(t);
                  await savingProcess();
                }}
              >
                Зберегти
              </Button>
            </div>
          </div>
        ),
        { duration: 10000 }
      );
      return;
    }

    await savingProcess();
  };

  // Вынесем процесс сохранения в отдельную функцию
  const savingProcess = async () => {
    if (!config) return;

    try {
      let savedConfig: ScreenConfig | null = null;
      const toastId = toast.loading(`${config._id ? 'Оновлення' : 'Створення'} конфігурації...`);

      if (config._id) {
        // Обновляем существующую конфигурацию
        savedConfig = await updateConfig(config._id, {
          name: config.name,
          sections: config.sections,
        });
      } else {
        // Создаем новую конфигурацию
        savedConfig = await createConfig({
          name: config.name,
          sections: config.sections,
          isActive: false,
          version: 1,
        });
      }

      // Задержка перед закрытием toast.loading для лучшей UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.dismiss(toastId);

      if (savedConfig) {
        setConfig(savedConfig);

        // Показываем успешное сохранение
        toast.success(`Конфігурація "${savedConfig.name}" успішно збережена!`, {
          duration: 3000, // Увеличиваем длительность тоста до 3 сек
        });

        // Добавляем небольшую задержку перед обновлением списка конфигураций
        // чтобы тост успел полностью отобразиться
        setTimeout(async () => {
          await fetchConfigs();
        }, 1000);
      }
    } catch {
      toast.error('Помилка при збереженні конфігурації');
    }
  };

  // Удаление конфигурации
  const handleDeleteConfig = async () => {
    if (!config || !config._id) {
      toast.error('Нет конфігурації для видалення');
      return;
    }

    // Используем toast вместо confirm
    toast.custom(
      (t) => (
        <div className="bg-base-100 max-w-md rounded-lg border p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-bold">Видалити конфігурацію "{config.name}"?</h3>
          <p className="mb-4 text-sm text-gray-600">
            Це дія незворотне. Конфігурація буде повністю видалена з системи.
            {config.isActive && (
              <strong className="text-danger-500 mt-2 block">
                Увага! Ви видаляєте активну конфігурацію.
              </strong>
            )}
          </p>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => toast.dismiss(t)}>
              Отмена
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={async () => {
                toast.dismiss(t);

                try {
                  const toastId = toast.loading('Видалення конфігурації...');
                  const success = await deleteConfig(config._id);
                  toast.dismiss(toastId);

                  if (success) {
                    setConfig(null);
                    selectSection(null);
                    await fetchConfigs();
                    toast.success(`Конфігурація "${config.name}" успішно видалена!`);
                  } else {
                    toast.error('Не вдалося видалити конфігурацію');
                  }
                } catch {
                  toast.error('Помилка при видаленні конфігурації');
                }
              }}
            >
              Видалити
            </Button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  // Дублирование конфигурации
  const handleDuplicateConfig = async () => {
    if (!config) return;

    try {
      const newConfig = await createConfig({
        name: `${config.name} (копія)`,
        sections: config.sections,
        isActive: false,
        version: 1,
      });

      if (newConfig) {
        setConfig(newConfig);
        await fetchConfigs();
        toast.success('Конфігурація успішно дублювана!');
      }
    } catch {
      toast.error('Помилка при дублюванні конфігурації');
    }
  };

  // Изменение имени конфигурации
  const handleConfigNameChange = (name: string) => {
    if (!config) return;

    setConfig({
      ...config,
      name,
      updatedAt: new Date().toISOString(),
    });
  };

  // Добавление секции
  const handleAddSection = (type: SectionType) => {
    addSection(type, `Секція (${type})`);
  };

  // Добавление элемента
  const handleAddItem = (type: ItemType) => {
    if (!selectedSectionId) return;
    addItem(selectedSectionId, type);
  };

  // Переключение между режимами редактирования и предпросмотра
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Сброс конфигурации (очистка редактора)
  const resetConfig = () => {
    // Устанавливаем пустую конфигурацию
    setConfig(null);
    // Сбрасываем выбранные элементы
    selectSection(null);
    // Уведомляем пользователя
    toast.success('Редактор очищений');
  };

  return {
    // Состояние
    isPreviewMode,
    deviceSize,
    activeId,
    configs,
    config,
    selectedSectionId,
    selectedItemId,
    selectedSection,
    selectedItem,
    loading,

    // Обработчики
    handleDragStart,
    handleDragEnd,
    handleLoadConfig,
    handleLoadActiveConfig,
    handleActivateConfig,
    handleSaveConfig,
    handleDeleteConfig,
    handleDuplicateConfig,
    handleConfigNameChange,
    handleAddSection,
    handleAddItem,
    togglePreviewMode,
    resetConfig,

    // Методы из других хуков
    updateSection,
    deleteSection,
    moveSection,
    updateItem,
    deleteItem,
    selectSection,
    selectItem,
    setConfig,
  };
};

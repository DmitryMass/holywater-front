import BuilderToolbar from '@components/builder/BuilderToolbar';
import ItemPalette from '@components/builder/ItemPalette';
import JsonPreview from '@components/builder/JsonPreview';
import PropertyPanel from '@components/builder/PropertyPanel';
import SectionEditor from '@components/builder/SectionEditor';
import SectionPalette from '@components/builder/SectionPalette';
import MobilePreview from '@components/preview/MobilePreview';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBuilderPage } from '@hooks/useBuilderPage';

import { useState } from 'react';

const BuilderPage = () => {
  const {
    // Состояние
    isPreviewMode,
    deviceSize,
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
    selectSection,

    // Методы
    updateSection,
    deleteSection,
    moveSection,
    updateItem,
    deleteItem,
    selectItem,
  } = useBuilderPage();

  // Состояние для отображения панелей на мобильных устройствах
  const [activeMobilePanel, setActiveMobilePanel] = useState<'editor' | 'palette' | 'properties'>(
    'editor'
  );

  // Функция для сброса состояния редактора
  const handleResetConfig = () => {
    // Вызываем метод сброса из хука
    resetConfig();

    // Переходим к редактору на мобильных устройствах
    setActiveMobilePanel('editor');
  };

  // Настройка сенсоров для drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
        tolerance: 5,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Верхняя панель инструментов */}
      <BuilderToolbar
        configName={config?.name || ''}
        configs={configs}
        onSave={handleSaveConfig}
        onConfigNameChange={handleConfigNameChange}
        onLoadConfig={handleLoadConfig}
        onLoadActiveConfig={handleLoadActiveConfig}
        onActivateConfig={handleActivateConfig}
        onDuplicate={handleDuplicateConfig}
        onDelete={handleDeleteConfig}
        onPreviewToggle={togglePreviewMode}
        onResetConfig={handleResetConfig}
        isPreviewMode={isPreviewMode}
        loading={loading}
        isCurrentConfigActive={config?.isActive}
        currentConfigId={config?._id}
      />

      {/* Содержимое страницы зависит от режима */}
      {isPreviewMode ? (
        <div className="container mx-auto flex flex-col gap-4 p-4 md:flex-row">
          {/* Превью мобильного устройства */}
          <div className="flex w-full justify-center md:w-1/2">
            <MobilePreview config={config} deviceSize={deviceSize} />
          </div>

          {/* JSON превью */}
          <div className="w-full md:w-1/2">
            <JsonPreview data={config ? (config as unknown as Record<string, unknown>) : {}} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-4">
          {/* Мобильные переключатели для секций */}
          <div className="mb-4 flex justify-center gap-2 lg:hidden">
            <button
              className={`btn ${activeMobilePanel === 'palette' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveMobilePanel('palette')}
            >
              Палітра
            </button>
            <button
              className={`btn ${activeMobilePanel === 'editor' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveMobilePanel('editor')}
            >
              Редактор
            </button>
            <button
              className={`btn ${activeMobilePanel === 'properties' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveMobilePanel('properties')}
            >
              Властивості
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Левая панель с палитрами */}
            <div
              className={`space-y-6 lg:sticky lg:top-4 lg:col-span-3 lg:block lg:max-h-[calc(100vh-120px)] lg:self-start lg:overflow-y-auto ${activeMobilePanel === 'palette' ? 'block' : 'hidden lg:block'}`}
            >
              <SectionPalette onAddSection={handleAddSection} className="mb-4" />
              <ItemPalette
                onAddItem={handleAddItem}
                sectionId={selectedSectionId}
                className="mb-4"
              />
            </div>

            {/* Центральная область с редактором секций */}
            <div
              className={`bg-base-100 min-h-[600px] rounded-lg p-4 lg:col-span-6 ${activeMobilePanel === 'editor' ? 'block' : 'hidden lg:block'}`}
            >
              <h2 className="mb-4 text-xl font-bold">Редактор</h2>

              {loading && (
                <div className="flex justify-center py-8">
                  <div className="loading loading-spinner text-primary"></div>
                </div>
              )}

              {!loading && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  autoScroll={true}
                >
                  <SortableContext
                    items={config?.sections.map((s) => s.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {config?.sections.map((section) => (
                      <SectionEditor
                        key={section.id}
                        section={section}
                        isSelected={section.id === selectedSectionId}
                        onSectionChange={(updatedSection) =>
                          updateSection(section.id, updatedSection)
                        }
                        onSectionDelete={() => deleteSection(section.id)}
                        onSectionMove={(id, direction) => moveSection(id, direction)}
                        onSectionSelect={(id) => {
                          selectSection(id);
                          // На мобильных переключаемся на свойства при выборе секции
                          if (window.innerWidth < 1024) {
                            setActiveMobilePanel('properties');
                          }
                        }}
                        onItemSelect={(sectionId, itemId) => {
                          selectItem(sectionId, itemId);
                          // На мобильных переключаемся на свойства при выборе элемента
                          if (window.innerWidth < 1024) {
                            setActiveMobilePanel('properties');
                          }
                        }}
                        selectedItemId={selectedItemId}
                        onItemDelete={deleteItem}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}

              {!loading && (!config || config.sections.length === 0) && (
                <div className="border-base-300 flex flex-col items-center rounded-md border border-dashed p-8 text-center">
                  <p className="text-base-content mb-4">Додайте секції з палітри ліворуч</p>
                  <button
                    className="btn btn-primary btn-sm lg:hidden"
                    onClick={() => setActiveMobilePanel('palette')}
                  >
                    Відкрити палітру
                  </button>
                </div>
              )}
            </div>

            {/* Правая панель с свойствами и JSON */}
            <div
              className={`space-y-6 lg:sticky lg:top-4 lg:col-span-3 lg:block lg:max-h-[calc(100vh-120px)] lg:self-start lg:overflow-y-auto ${activeMobilePanel === 'properties' ? 'block' : 'hidden lg:block'}`}
            >
              <PropertyPanel
                selectedSection={selectedSection}
                selectedItem={selectedItem}
                onSectionChange={(section) =>
                  selectedSection && updateSection(selectedSection.id, section)
                }
                onItemChange={(sectionId, itemId, item) => {
                  updateItem(sectionId, itemId, item);
                }}
                onDeleteItem={deleteItem}
                onDeleteSection={deleteSection}
                className="mb-4"
              />

              <JsonPreview
                data={config ? (config as unknown as Record<string, unknown>) : {}}
                className="mb-4"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderPage;

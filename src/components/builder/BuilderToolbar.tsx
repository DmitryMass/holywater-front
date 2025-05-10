import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Modal from '@components/ui/Modal';
import { type UseBuilderToolbarProps, useBuilderToolbar } from '@hooks/useBuilderToolbar';
import { PATHS } from '@utils/paths';

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Тип пропсов совпадает с пропсами хука, но с дополнительными свойствами для UI
type BuilderToolbarProps = UseBuilderToolbarProps & {
  loading?: boolean;
  isCurrentConfigActive?: boolean;
  currentConfigId?: string;
  onSave: () => void;
  onResetConfig?: () => void;
};

const BuilderToolbar = ({
  configName,
  configs,
  onConfigNameChange,
  onLoadConfig,
  onLoadActiveConfig,
  onActivateConfig,
  onDuplicate,
  onDelete,
  onPreviewToggle,
  isPreviewMode,
  loading = false,
  isCurrentConfigActive = false,
  currentConfigId,
  onSave,
  onResetConfig,
}: BuilderToolbarProps) => {
  const {
    isNewModalOpen,
    isLoadModalOpen,
    newConfigName,
    setNewConfigName,
    handleNewClick,
    handleCreateNewConfig,
    handleConfigSelect,
    handleLoadActiveConfig,
    openLoadModal,
    closeLoadModal,
    closeNewModal,
    isCreatingConfig,
  } = useBuilderToolbar({
    configName,
    configs,
    onConfigNameChange,
    onLoadConfig,
    onLoadActiveConfig,
    onActivateConfig,
    onDuplicate,
    onDelete,
    onPreviewToggle,
    isPreviewMode,
  });

  // Состояние для мобильного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-base-100 flex w-full flex-wrap items-center justify-between gap-2 px-4 py-2 shadow-md">
      <div className="flex items-center gap-3">
        <Link to={PATHS.HOME} className="btn btn-ghost btn-sm" title="Повернутися на головну">
          <span>←</span>
        </Link>
        <h1 className="font-dancing-script text-2xl font-bold">WB</h1>
      </div>

      <div className="max-w-md flex-1 px-4">
        <Input
          name="configName"
          placeholder="Назва конфігурації"
          value={configName}
          onChange={(e) => onConfigNameChange(e.target.value)}
          disabled={loading || !currentConfigId}
        />
      </div>

      {/* Десктопная версия кнопок */}
      <div className="hidden flex-wrap gap-2 xl:flex">
        <Button variant="primary" onClick={onSave} disabled={loading}>
          {loading ? 'Збереження...' : 'Зберегти'}
        </Button>
        <Button variant="outline" onClick={handleNewClick} disabled={loading}>
          Нова
        </Button>
        <Button variant="outline" onClick={openLoadModal} disabled={loading}>
          Завантажити
        </Button>
        <Button variant="outline" onClick={onDuplicate} disabled={loading}>
          Дублювати
        </Button>
        {onResetConfig && (
          <Button
            variant="outline"
            onClick={onResetConfig}
            disabled={loading}
            title="Очистити редактор"
          >
            Скинути
          </Button>
        )}
        <Button variant="danger" onClick={onDelete} disabled={loading}>
          Видалити
        </Button>
        {onActivateConfig && (
          <Button
            variant={isCurrentConfigActive ? 'success' : 'outline'}
            onClick={onActivateConfig}
            disabled={loading || isCurrentConfigActive}
            title={
              isCurrentConfigActive
                ? 'Ця конфігурація вже активна'
                : 'Зробити цю конфігурацію активною'
            }
          >
            {isCurrentConfigActive ? 'Активна' : 'Активувати'}
          </Button>
        )}
        <Button
          variant={isPreviewMode ? 'primary' : 'outline'}
          onClick={onPreviewToggle}
          disabled={loading}
        >
          {isPreviewMode ? 'Редактор' : 'Попередній перегляд'}
        </Button>
      </div>

      {/* Мобильная версия с выпадающим меню */}
      <div className="flex gap-2 xl:hidden">
        <Button variant="primary" onClick={onSave} disabled={loading} size="sm">
          {loading ? '...' : 'Зберегти'}
        </Button>
        <Button variant="outline" onClick={toggleMobileMenu} title="Меню" size="sm">
          ☰
        </Button>
        {isMobileMenuOpen && (
          <div className="ring-opacity-5 absolute top-16 right-2 z-20 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  handleNewClick();
                  setIsMobileMenuOpen(false);
                }}
                disabled={loading}
              >
                Нова конфігурація
              </button>

              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  openLoadModal();
                  setIsMobileMenuOpen(false);
                }}
                disabled={loading}
              >
                Завантажити конфігурацію
              </button>

              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onDuplicate();
                  setIsMobileMenuOpen(false);
                }}
                disabled={loading}
              >
                Дублювати
              </button>

              {onResetConfig && (
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onResetConfig();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={loading}
                >
                  Скинути
                </button>
              )}

              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onDelete();
                  setIsMobileMenuOpen(false);
                }}
                disabled={loading}
              >
                Видалити
              </button>

              {onActivateConfig && (
                <button
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    isCurrentConfigActive
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    onActivateConfig();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={loading || isCurrentConfigActive}
                >
                  {isCurrentConfigActive ? '✓ Активна' : 'Активувати'}
                </button>
              )}

              <button
                className={`block w-full px-4 py-2 text-left text-sm ${
                  isPreviewMode ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  onPreviewToggle();
                  setIsMobileMenuOpen(false);
                }}
                disabled={loading}
              >
                {isPreviewMode ? 'Повернутися в редактор' : 'Попередній перегляд'}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Модальное окно для создания новой конфигурации */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={closeNewModal}
        title="Створити нову конфігурацію"
        footer={
          <>
            <Button variant="ghost" onClick={closeNewModal} disabled={isCreatingConfig}>
              Скасувати
            </Button>
            <Button variant="primary" onClick={handleCreateNewConfig} disabled={isCreatingConfig}>
              {isCreatingConfig ? 'Створення...' : 'Створити'}
            </Button>
          </>
        }
      >
        <div className="p-2">
          <Input
            name="newConfigName"
            label="Назва нової конфігурації"
            placeholder="Введіть назву"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
            required
            disabled={isCreatingConfig}
          />
        </div>
      </Modal>
      {/* Модальное окно для загрузки конфигурации */}
      <Modal
        isOpen={isLoadModalOpen}
        onClose={closeLoadModal}
        title="Завантажити конфігурацію"
        footer={
          <>
            <Button variant="ghost" onClick={closeLoadModal} disabled={loading}>
              Скасувати
            </Button>
            {onLoadActiveConfig && (
              <Button variant="outline" onClick={handleLoadActiveConfig} disabled={loading}>
                Завантажити активну
              </Button>
            )}
          </>
        }
      >
        <div className="p-2">
          {loading && (
            <div className="mb-4 flex justify-center">
              <div className="loading loading-spinner text-primary"></div>
            </div>
          )}

          <div className="mb-4 text-sm text-gray-500">
            Тут відображаються всі раніше збережені конфігурації екранів з бази даних. Виберіть
            конфігурацію для редагування.
          </div>

          {configs.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Немає збережених конфігурацій</p>
              <p className="mt-2 text-sm text-gray-400">
                Збережіть конфігурацію, щоб вона з'явилася в цьому списку
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {configs.map((config) => (
                <div
                  key={config._id}
                  className={`hover:bg-base-200 mb-2 cursor-pointer rounded border p-3 ${
                    config.isActive ? 'border-success bg-success/10' : 'border-base-300'
                  }`}
                  onClick={() => !loading && handleConfigSelect(config._id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{config.name}</h3>
                      <div className="text-xs text-gray-500">
                        {new Date(config.updatedAt).toLocaleString()}
                      </div>
                      <div className="mt-1 text-xs">
                        <span className="badge badge-sm mr-1">
                          Секцій: {config.sections?.length || 0}
                        </span>
                        {config.isActive && (
                          <span className="badge badge-sm badge-success">Активна</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BuilderToolbar;

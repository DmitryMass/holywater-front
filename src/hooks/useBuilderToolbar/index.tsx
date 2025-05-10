import type { ScreenConfig } from '@/types';
import { useCreateScreenConfig } from '@hooks/useApi/useScreenConfigQueries';
import { toast } from 'sonner';

import { useState } from 'react';

export interface UseBuilderToolbarProps {
  configName: string;
  configs: ScreenConfig[];
  onConfigNameChange: (name: string) => void;
  onLoadConfig: (configId: string) => void;
  onLoadActiveConfig?: () => void;
  onActivateConfig?: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPreviewToggle: () => void;
  isPreviewMode: boolean;
}

export const useBuilderToolbar = ({ onLoadConfig, onLoadActiveConfig }: UseBuilderToolbarProps) => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const createConfigMutation = useCreateScreenConfig();

  const handleNewClick = () => {
    setNewConfigName('');
    setIsNewModalOpen(true);
  };

  const handleCreateNewConfig = async () => {
    if (!newConfigName.trim()) {
      toast.error('Введите название конфигурации');
      return;
    }

    try {
      await createConfigMutation.mutateAsync({
        name: newConfigName,
        sections: [],
        isActive: false,
        version: 1,
      });

      setIsNewModalOpen(false);
      toast.success(`Конфигурация "${newConfigName}" успешно создана!`);
    } catch {
      toast.error('Не удалось создать конфигурацию');
    }
  };

  const handleConfigSelect = (configId: string) => {
    onLoadConfig(configId);
    setIsLoadModalOpen(false);
  };

  const handleLoadActiveConfig = () => {
    if (onLoadActiveConfig) {
      onLoadActiveConfig();
      setIsLoadModalOpen(false);
    }
  };

  const openLoadModal = () => setIsLoadModalOpen(true);
  const closeLoadModal = () => setIsLoadModalOpen(false);
  const closeNewModal = () => setIsNewModalOpen(false);

  return {
    // Состояние
    isNewModalOpen,
    isLoadModalOpen,
    newConfigName,
    isCreatingConfig: createConfigMutation.isPending,

    // Методы
    setNewConfigName,
    handleNewClick,
    handleCreateNewConfig,
    handleConfigSelect,
    handleLoadActiveConfig,
    openLoadModal,
    closeLoadModal,
    closeNewModal,
  };
};

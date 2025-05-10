import { cn } from '@utils/styles';

import React, { useEffect, useState } from 'react';

export interface Tab {
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

const Tabs = ({ tabs, defaultTab, onChange, className }: TabsProps) => {
  // Определяем активную вкладку
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (defaultTab && tabs.some((tab) => tab.id === defaultTab)) {
      return defaultTab;
    }
    return tabs.length > 0 ? tabs[0].id : '';
  });

  // Обновляем activeTab если изменились входные параметры
  useEffect(() => {
    if (defaultTab && activeTab !== defaultTab && tabs.some((tab) => tab.id === defaultTab)) {
      setActiveTab(defaultTab);
    } else if (!tabs.some((tab) => tab.id === activeTab) && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, defaultTab, activeTab]);

  // Обработчик переключения вкладки
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="tabs tabs-bordered w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn('tab', activeTab === tab.id ? 'tab-active' : '')}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn('tab-content', activeTab === tab.id ? 'block' : 'hidden')}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

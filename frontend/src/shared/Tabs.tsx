// components/Tabs.tsx
import { useState, ReactNode } from "react";

interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export const Tabs = ({ tabs, defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.key);

  const activeContent = tabs.find((tab) => tab.key === activeTab)?.content;

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="flex gap-1 border-b justify-center border-border mb-4 relative"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`
                relative px-4 py-2 text-sm font-medium transition-colors
                cursor-pointer outline-none
                ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab.label}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">{activeContent}</div>
    </div>
  );
};
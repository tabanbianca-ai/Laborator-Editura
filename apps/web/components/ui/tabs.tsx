import type { ReactNode } from "react";

interface TabsProps {
  activeValue: string;
  items: Array<{
    label: string;
    value: string;
  }>;
  onSelect?: (value: string) => void;
}

interface TabPanelProps {
  children: ReactNode;
  labelledBy: string;
}

export function Tabs({ activeValue, items, onSelect }: TabsProps) {
  return (
    <div className="ui-tabs" role="tablist">
      {items.map((item) => (
        <button
          aria-selected={activeValue === item.value}
          className={activeValue === item.value ? "ui-tab ui-tab-active" : "ui-tab"}
          id={`tab-${item.value}`}
          key={item.value}
          onClick={() => onSelect?.(item.value)}
          role="tab"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ children, labelledBy }: TabPanelProps) {
  return (
    <div aria-labelledby={labelledBy} className="ui-tab-panel" role="tabpanel">
      {children}
    </div>
  );
}

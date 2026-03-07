"use client";

import { type VisibilityState } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { columnDefs } from "./columns";

type ColumnVisibilityControlProps = {
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (visibility: VisibilityState) => void;
};

export function ColumnVisibilityControl({
  columnVisibility,
  onColumnVisibilityChange,
}: ColumnVisibilityControlProps): React.JSX.Element {
  const toggle = (key: string, checked: boolean): void => {
    onColumnVisibilityChange({ ...columnVisibility, [key]: checked });
  };

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border bg-card p-4">
      {columnDefs.map(({ key, label }) => {
        const isVisible = columnVisibility[key] !== false;
        return (
          <div key={key} className="flex items-center gap-1.5">
            <Switch
              id={`col-${key}`}
              size="sm"
              checked={isVisible}
              onCheckedChange={(checked) => toggle(key, checked)}
            />
            <label htmlFor={`col-${key}`} className="cursor-pointer text-sm">
              {label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

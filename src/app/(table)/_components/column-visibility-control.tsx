"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { Switch } from "@/components/ui/switch";
import { columnDefs } from "./columns";

export function ColumnVisibilityControl(): React.JSX.Element {
  const [hiddenColumns, setHiddenColumns] = useQueryState(
    "hidden",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const toggle = (key: string, checked: boolean): void => {
    void setHiddenColumns((prev) => (checked ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border bg-card p-4">
      {columnDefs.map(({ key, label }) => {
        const isVisible = !hiddenColumns.includes(key);
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

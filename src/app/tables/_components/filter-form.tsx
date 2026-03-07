"use client";

import { useQueryStates } from "nuqs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterParsers } from "../_lib/schema";

export function FilterForm(): React.JSX.Element {
  const [params, setParams] = useQueryStates(filterParsers);

  const [name, setName] = useState(params.name);
  const [minImpressions, setMinImpressions] = useState(params.minImpressions);
  const [minConversions, setMinConversions] = useState(params.minConversions);

  const handleSubmit = (): void => {
    void setParams({ name, minImpressions, minConversions });
  };

  const handleReset = (): void => {
    setName("");
    setMinImpressions(0);
    setMinConversions(0);
    void setParams({ name: "", minImpressions: 0, minConversions: 0 });
  };

  return (
    <form
      action={handleSubmit}
      className="flex flex-wrap items-end gap-4 rounded-lg border bg-card p-4"
    >
      <div className="flex min-w-48 flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          キャンペーン名
        </label>
        <Input
          id="name"
          placeholder="キャンペーン名で検索"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex min-w-40 flex-col gap-1.5">
        <label htmlFor="minImpressions" className="text-sm font-medium">
          最小インプレッション数
        </label>
        <Input
          id="minImpressions"
          type="number"
          min={0}
          value={minImpressions || ""}
          onChange={(e) => setMinImpressions(e.target.value ? Number(e.target.value) : 0)}
        />
      </div>

      <div className="flex min-w-36 flex-col gap-1.5">
        <label htmlFor="minConversions" className="text-sm font-medium">
          最小CV数
        </label>
        <Input
          id="minConversions"
          type="number"
          min={0}
          value={minConversions || ""}
          onChange={(e) => setMinConversions(e.target.value ? Number(e.target.value) : 0)}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">検索</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          リセット
        </Button>
      </div>
    </form>
  );
}

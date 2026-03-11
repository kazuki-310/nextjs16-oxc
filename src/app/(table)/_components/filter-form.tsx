"use client";

import { useQueryStates } from "nuqs";
import { useState } from "react";
import { Button, Group, NumberInput, Paper, TextInput } from "@mantine/core";
import { filterParsers } from "../_lib/schema";

export function FilterForm(): React.JSX.Element {
  const [params, setParams] = useQueryStates(filterParsers);

  const [name, setName] = useState(params.name);
  const [minImpressions, setMinImpressions] = useState<number>(params.minImpressions);
  const [minConversions, setMinConversions] = useState<number>(params.minConversions);

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
    <Paper component="form" action={handleSubmit} withBorder p="md">
      <Group align="flex-end" gap="md" wrap="wrap">
        <TextInput
          label="キャンペーン名"
          placeholder="キャンペーン名で検索"
          value={name}
          onChange={(e) => setName(e.target.value)}
          miw={192}
        />
        <NumberInput
          label="最小インプレッション数"
          min={0}
          value={minImpressions || ""}
          onChange={(val) => setMinImpressions(typeof val === "number" ? val : 0)}
          miw={160}
        />
        <NumberInput
          label="最小CV数"
          min={0}
          value={minConversions || ""}
          onChange={(val) => setMinConversions(typeof val === "number" ? val : 0)}
          miw={144}
        />
        <Group gap="xs">
          <Button type="submit">検索</Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            リセット
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}

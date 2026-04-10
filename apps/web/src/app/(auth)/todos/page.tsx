import { Stack, Title } from "@mantine/core";
import { Suspense } from "react";

import { TodoContainer } from "./components/todo-container";

export default function Page(): React.JSX.Element {
  return (
    <Stack gap="md" p="md" maw={500}>
      <Title order={2}>Todo リスト</Title>
      <Suspense fallback={null}>
        <TodoContainer />
      </Suspense>
    </Stack>
  );
}

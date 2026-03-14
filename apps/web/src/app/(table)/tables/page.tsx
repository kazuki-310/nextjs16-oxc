import { Box, Container, Stack, Title } from "@mantine/core";
import type { Metadata } from "next";
import { Suspense } from "react";

import { ColumnVisibilityControl } from "../_components/column-visibility-control";
import { FilterForm } from "../_components/filter-form";
import { TablesLoadingFallback } from "../_components/tables-loading-fallback";
import { TablesContainer } from "./_components/tables-container";

export const metadata: Metadata = {
  title: "広告レポート一覧",
  description: "広告レポートの一覧を確認・フィルタリングできます。",
};

export default function Page(): React.JSX.Element {
  return (
    <Container component="main" size="xl" p="xl">
      <Stack gap="xl">
        <Title order={1} fz="xl" fw={700}>
          広告レポート一覧
        </Title>
        <Suspense>
          <Box>
            <Stack gap="md">
              <FilterForm />
              <ColumnVisibilityControl />
            </Stack>
          </Box>
        </Suspense>
        <Suspense fallback={<TablesLoadingFallback />}>
          <TablesContainer />
        </Suspense>
      </Stack>
    </Container>
  );
}

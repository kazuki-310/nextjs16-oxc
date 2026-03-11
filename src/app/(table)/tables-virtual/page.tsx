import type { Metadata } from "next";
import { Suspense } from "react";
import { Box, Container, Stack, Title } from "@mantine/core";
import { FilterForm } from "../_components/filter-form";
import { ColumnVisibilityControl } from "../_components/column-visibility-control";
import { TablesContainerVirtual } from "./_components/tables-container-virtual";
import { TablesLoadingFallback } from "../_components/tables-loading-fallback";

export const metadata: Metadata = {
  title: "広告レポート一覧（仮想化）",
  description: "仮想スクロールを使った広告レポートの一覧を確認・フィルタリングできます。",
};

export default function Page(): React.JSX.Element {
  return (
    <Container component="main" size="xl" p="xl">
      <Stack gap="xl">
        <Title order={1} fz="xl" fw={700}>
          広告レポート一覧（仮想化）
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
          <TablesContainerVirtual />
        </Suspense>
      </Stack>
    </Container>
  );
}

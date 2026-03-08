import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterForm } from "../_components/filter-form";
import { ColumnVisibilityControl } from "../_components/column-visibility-control";
import { TablesContainer } from "./_components/tables-container";
import { TablesLoadingFallback } from "../_components/tables-loading-fallback";

export const metadata: Metadata = {
  title: "広告レポート一覧",
  description: "広告レポートの一覧を確認・フィルタリングできます。",
};

export default function Page(): React.JSX.Element {
  return (
    <main className="container mx-auto flex flex-col gap-10 p-8">
      <h1 className="text-xl font-bold">広告レポート一覧</h1>
      <Suspense>
        <FilterForm />
        <ColumnVisibilityControl />
      </Suspense>
      <Suspense fallback={<TablesLoadingFallback />}>
        <TablesContainer />
      </Suspense>
    </main>
  );
}

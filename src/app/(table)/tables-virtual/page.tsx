import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterForm } from "../_components/filter-form";
import { TablesContentVirtual } from "./_components/tables-content-virtual";

export const metadata: Metadata = {
  title: "広告レポート一覧（仮想化）",
  description: "仮想スクロールを使った広告レポートの一覧を確認・フィルタリングできます。",
};

export default function Page(): React.JSX.Element {
  return (
    <main className="container mx-auto flex flex-col gap-10 p-8">
      <h1 className="text-xl font-bold">広告レポート一覧（仮想化）</h1>
      <Suspense>
        <FilterForm />
        <TablesContentVirtual />
      </Suspense>
    </main>
  );
}

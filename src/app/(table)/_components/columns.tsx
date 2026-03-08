import { type Column, type ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type AdRow } from "../_lib/constants";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>): React.JSX.Element {
  if (!column.getCanSort()) {
    return <span className="text-sm font-medium">{title}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="size-3" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3" />
      ) : (
        <ArrowUpDown className="size-3 text-muted-foreground" />
      )}
    </Button>
  );
}

export const columnDefs: { key: keyof AdRow; label: string }[] = [
  { key: "name", label: "キャンペーン名" },
  { key: "impressions", label: "インプレッション数" },
  { key: "clicks", label: "クリック数" },
  { key: "ctr", label: "CTR (%)" },
  { key: "conversions", label: "CV数" },
  { key: "cvr", label: "CVR (%)" },
  { key: "cost", label: "費用 (円)" },
  { key: "cpc", label: "CPC (円)" },
  { key: "cpa", label: "CPA (円)" },
  { key: "revenue", label: "売上 (円)" },
  { key: "roas", label: "ROAS (%)" },
  { key: "reach", label: "リーチ数" },
  { key: "frequency", label: "フリークエンシー" },
  { key: "cpm", label: "CPM (円)" },
  { key: "viewRate", label: "視聴率 (%)" },
  { key: "engagement", label: "エンゲージメント数" },
  { key: "engagementRate", label: "エンゲージメント率 (%)" },
  { key: "videoViews", label: "動画視聴数" },
  { key: "bounceRate", label: "直帰率 (%)" },
  { key: "avgPosition", label: "平均掲載順位" },
  { key: "qualityScore", label: "品質スコア" },
  { key: "impressionShare", label: "インプレッションシェア (%)" },
  { key: "lostImpressionShareBudget", label: "予算消失IS (%)" },
  { key: "lostImpressionShareRank", label: "品質消失IS (%)" },
  { key: "allConversions", label: "全CV数" },
];

export const columns: ColumnDef<AdRow>[] = columnDefs.map(({ key, label }) => ({
  accessorKey: key,
  header: ({ column }): React.JSX.Element => (
    <DataTableColumnHeader column={column} title={label} />
  ),
}));

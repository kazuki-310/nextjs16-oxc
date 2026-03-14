import { ActionIcon, Group, Text } from "@mantine/core";
import { type Column, type ColumnDef } from "@tanstack/react-table";

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
    return (
      <Text fz="sm" fw={500}>
        {title}
      </Text>
    );
  }

  const sorted = column.getIsSorted();

  return (
    <Group gap={4} wrap="nowrap">
      <ActionIcon
        variant="subtle"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label={`${title}でソート`}
      >
        {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
      </ActionIcon>
      <Text fz="sm" fw={500}>
        {title}
      </Text>
    </Group>
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

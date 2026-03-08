import { tableConfigs } from "../_lib/constants";
import { TableSkeleton } from "./table-skeleton";

const PREVIEW_COUNT = 3;

export function TablesLoadingFallback(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-10">
      {tableConfigs.slice(0, PREVIEW_COUNT).map((config) => (
        <TableSkeleton key={config.id} title={config.title} />
      ))}
    </div>
  );
}

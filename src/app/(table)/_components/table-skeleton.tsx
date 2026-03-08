import { Skeleton } from "@/components/ui/skeleton";
import { columnDefs } from "./columns";

const SKELETON_ROW_COUNT = 5;

type Props = {
  title: string;
};

export function TableSkeleton({ title }: Props): React.JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="max-h-[660px] overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-20 bg-background [&_tr]:border-b">
            <tr className="border-b transition-colors">
              {columnDefs.map(({ key, label }) => (
                <th
                  key={key}
                  className="h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-muted-foreground"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b transition-colors">
                {columnDefs.map(({ key }) => (
                  <td key={key} className="p-2 align-middle">
                    <Skeleton className="h-4 min-w-16" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

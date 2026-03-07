"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import type { AdRow } from "../../_lib/constants";
import { columns } from "../../_components/columns";

type AdDataTableVirtualProps = {
  title: string;
  data: AdRow[];
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (visibility: VisibilityState) => void;
};

const STICKY_COLUMN_ID = "name";
const ROW_HEIGHT = 36;

export function AdDataTableVirtual({
  title,
  data,
  columnVisibility,
  onColumnVisibilityChange,
}: AdDataTableVirtualProps): React.JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnVisibility) : updater;
      onColumnVisibilityChange(next);
    },
    state: { sorting, columnVisibility },
  });

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom =
    virtualItems.length > 0 ? totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0) : 0;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>

      <div ref={scrollRef} className="max-h-[660px] overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-20 bg-background [&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSticky = header.column.id === STICKY_COLUMN_ID;
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isSticky
                          ? "sticky left-0 z-30 bg-background shadow-[1px_0_0_0_hsl(var(--border))]"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {rows.length > 0 ? (
              <>
                {paddingTop > 0 && (
                  <tr>
                    <td style={{ height: paddingTop }} />
                  </tr>
                )}
                {virtualItems.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isSticky = cell.column.id === STICKY_COLUMN_ID;
                        return (
                          <TableCell
                            key={cell.id}
                            className={
                              isSticky
                                ? "sticky left-0 z-10 bg-background shadow-[1px_0_0_0_hsl(var(--border))]"
                                : undefined
                            }
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: paddingBottom }} />
                  </tr>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

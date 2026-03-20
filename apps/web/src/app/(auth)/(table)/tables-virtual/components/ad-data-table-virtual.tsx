"use client";

import { Table, Text } from "@mantine/core";
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

import { columns } from "../../components/columns";
import type { AdRow } from "../../lib/constants";

type Props = {
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
}: Props): React.JSX.Element {
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

  const headingId = `table-heading-${title.replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={headingId}>
      <Text id={headingId} fz="sm" fw={600} mb="xs">
        {title}
      </Text>
      <div
        ref={scrollRef}
        style={{
          maxHeight: 660,
          overflow: "auto",
          border: "1px solid var(--mantine-color-default-border)",
          borderRadius: "var(--mantine-radius-sm)",
        }}
      >
        <Table withColumnBorders highlightOnHover>
          <Table.Thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              background: "var(--mantine-color-body)",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSticky = header.column.id === STICKY_COLUMN_ID;
                  return (
                    <Table.Th
                      key={header.id}
                      style={
                        isSticky
                          ? {
                              position: "sticky",
                              left: 0,
                              zIndex: 30,
                              background: "var(--mantine-color-body)",
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
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
                    <Table.Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        const isSticky = cell.column.id === STICKY_COLUMN_ID;
                        return (
                          <Table.Td
                            key={cell.id}
                            style={
                              isSticky
                                ? {
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 10,
                                    background: "var(--mantine-color-body)",
                                  }
                                : undefined
                            }
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td style={{ height: paddingBottom }} />
                  </tr>
                )}
              </>
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={table.getAllColumns().length}
                  style={{ textAlign: "center", height: 96 }}
                >
                  データがありません
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </section>
  );
}

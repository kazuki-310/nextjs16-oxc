"use client";

import { Skeleton, Table, Text } from "@mantine/core";

import { columnDefs } from "./columns";

const SKELETON_ROW_COUNT = 5;

type Props = {
  title: string;
};

export function TableSkeleton({ title }: Props): React.JSX.Element {
  return (
    <section>
      <Text fz="sm" fw={600} mb="xs">
        {title}
      </Text>
      <div
        style={{
          maxHeight: 660,
          overflow: "auto",
          border: "1px solid var(--mantine-color-default-border)",
          borderRadius: "var(--mantine-radius-sm)",
        }}
      >
        <Table striped highlightOnHover withColumnBorders>
          <Table.Thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              background: "var(--mantine-color-body)",
            }}
          >
            <Table.Tr>
              {columnDefs.map(({ key, label }) => (
                <Table.Th key={key} style={{ whiteSpace: "nowrap" }}>
                  {label}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {columnDefs.map(({ key }) => (
                  <Table.Td key={key}>
                    <Skeleton height={16} maw={64} />
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </section>
  );
}

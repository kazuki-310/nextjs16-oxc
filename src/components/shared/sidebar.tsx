"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, NavLink, Text } from "@mantine/core";

const navItems = [
  { href: "/tables", label: "広告レポート" },
  { href: "/tables-virtual", label: "広告レポート（仮想化）" },
];

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      component="aside"
      style={{
        width: 224,
        flexShrink: 0,
        height: "100vh",
        borderRight: "1px solid var(--mantine-color-default-border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
          padding: "16px",
        }}
      >
        <Text fw={600} fz="sm">
          広告管理
        </Text>
      </Box>
      <Box component="nav" p="xs">
        {navItems.map(({ href, label }) => (
          <NavLink
            key={href}
            component={Link}
            href={href}
            label={label}
            active={pathname === href}
          />
        ))}
      </Box>
    </Box>
  );
}

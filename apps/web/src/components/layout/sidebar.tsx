"use client";

import { Box, Button, NavLink, Text } from "@mantine/core";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/hub", label: "オペレーションハブ" },
  { href: "/focus-tips", label: "集中ヒント" },
  { href: "/memos", label: "メモ帳" },
  { href: "/tables", label: "広告レポート" },
  { href: "/tables-virtual", label: "広告レポート（仮想化）" },
];

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();

  const handleSignOut = async (): Promise<void> => {
    await signOut({ callbackUrl: "/login" });
  };

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
      <Box component="nav" p="xs" style={{ flex: 1 }}>
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
      <Box p="xs" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
        <Button variant="subtle" color="red" size="sm" fullWidth onClick={handleSignOut}>
          ログアウト
        </Button>
      </Box>
    </Box>
  );
}

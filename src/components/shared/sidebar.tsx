"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/tables", label: "広告レポート" },
  { href: "/tables-virtual", label: "広告レポート（仮想化）" },
];

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r bg-card">
      <div className="border-b px-4 py-4">
        <span className="text-sm font-semibold">広告管理</span>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === href
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

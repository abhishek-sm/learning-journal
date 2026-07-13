import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { LayoutDashboard, FileText, FolderTree, FileEdit, Settings, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/drafts", label: "Drafts", icon: FileEdit },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
        <Link href="/" className="mb-8 px-2 text-sm font-semibold tracking-tight">
          Learning Journal
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LogOut size={16} />
            Log out
          </button>
        </form>
      </aside>
      <div className="flex-1 bg-background">{children}</div>
    </div>
  );
}

import { Link, useMatches } from "@tanstack/react-router";
import { LayoutDashboard, Users, CheckSquare, ScrollText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "",
    items: [{ title: "ダッシュボード", to: "/dashboard" as const, icon: LayoutDashboard }],
  },
  {
    label: "管理",
    items: [
      { title: "ユーザー", to: "/users" as const, icon: Users },
      { title: "ToDo", to: "/todos" as const, icon: CheckSquare },
    ],
  },
  {
    label: "システム",
    items: [{ title: "監査ログ", to: "/audit-logs" as const, icon: ScrollText }],
  },
];

export function AppSidebar() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname ?? "";

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <span className="text-lg font-bold">ACME Admin</span>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label || "top"}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={currentPath.startsWith(item.to)}>
                      <Link to={item.to}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

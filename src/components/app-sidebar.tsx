import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import PersistentSidebar from "./PersistentSidebar";
import { PersistentSidebarProps } from "@/types";

export function AppSidebar({ stats, resources }: PersistentSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <PersistentSidebar stats={stats} resources={resources} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

import { SidebarProvider } from "#/components";
import { Outlet } from "react-router";

export default function ProviderLayout() {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
}

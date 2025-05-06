import { SidebarProvider } from "#/components";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
export default function ProviderLayout() {
  return (
    <SidebarProvider>
      <Outlet />

      <Toaster />
    </SidebarProvider>
  );
}

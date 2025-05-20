import { SidebarProvider, TooltipProvider } from "#/components";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
export default function ProviderLayout() {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <Outlet />
      </TooltipProvider>
      <Toaster />
    </SidebarProvider>
  );
}

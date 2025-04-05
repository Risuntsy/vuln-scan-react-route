import { AppSidebar } from "#/components";
import { menuItems } from "#/routes";
import { Outlet } from "react-router";

export default function NavLayout() {

  return (
    <>
      <AppSidebar items={menuItems} />
      <main className="flex-1 overflow-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </>
  );
}

import { AppSidebar } from "#/components";
import { menuItems } from "#/routes";
import { Outlet } from "react-router";

export default function NavLayout() {

  return (
    <>
      <AppSidebar items={menuItems} />
      <main className="flex-1">
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </>
  );
}

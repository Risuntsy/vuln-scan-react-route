import { AppSidebar } from "#/components";
import { menuItems } from "#/routes";
import { Outlet, useNavigation } from "react-router";
import { GlobalSpinner } from "#/components";
import { AIChatButton } from "#/components/ai-chat-button";

export default function NavLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== 'idle';

  return (
    <>
      {isNavigating && <GlobalSpinner />}
      <AppSidebar items={menuItems} />
      <main className="flex-1 overflow-auto">
        <div className="min-h-full">
          <Outlet />
        </div>

        <AIChatButton />
      </main>
    </>
  );
}

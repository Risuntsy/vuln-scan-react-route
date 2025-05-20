import { AppSidebar } from "#/components";
import { menuItems } from "#/routes";
import { Outlet, redirect, useNavigation, type LoaderFunctionArgs } from "react-router";
import { GlobalSpinner } from "#/components";
import { AIChatButton } from "#/components/custom/ai/ai-chat-button";
import { getUser } from "#/lib";
// import { useEffect, useState } from "react";


export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  return { user };
}


export default function NavLayout({ loaderData }: { loaderData: { user: string } }) {
  // const navigation = useNavigation();
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (navigation.state !== 'idle') {
  //     setIsLoading(true);
  //   } else {
  //     // Add delay before hiding spinner
  //     const timer = setTimeout(() => {
  //       setIsLoading(false);
  //     }, 500); // 500ms delay

  //     return () => clearTimeout(timer);
  //   }
  // }, [navigation.state]);

  return (
    <>
      {/* {isLoading && <GlobalSpinner />} */}
      <AppSidebar items={menuItems} user={loaderData.user} />
      <main className="flex-1 overflow-auto">
        <div className="min-h-full">
          <Outlet />
        </div>

        <AIChatButton />
      </main>
    </>
  );
}

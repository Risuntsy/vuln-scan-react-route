import { AlertAction, Button, CustomTooltip, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, errorToast, successToast, Toaster } from "#/components";
import { MoreHorizontal } from "lucide-react";

import { useEffect } from "react";
import { type ActionFunctionArgs, type LoaderFunctionArgs, useFetcher, useLoaderData } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  return "init data";
}

export async function action({ request }: ActionFunctionArgs) {
  // const formData = await request.formData();

  const data = await request.json();
  return {
    success: true,
    message: data?.message || "ok",
    data
  };
}

export default function TempPage() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData<typeof loader>();

  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
      if (fetcher.data?.success) {
        successToast(fetcher.data?.message || "操作成功");
      } else {
        errorToast(fetcher.data?.message || "操作失败");
      }
    }
  }, [fetcher.data]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <AlertAction
              itemContent={
                <span className="flex items-center">
                  <span>test button</span>
                </span>
              }
              onAction={() => {
                fetcher.submit(
                  { _action: "test", message: "WTF" + Math.random() },
                  { method: "post", encType: "application/json" }
                );
              }}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <span>{loaderData}</span>


      <CustomTooltip description="test tooltip">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CustomTooltip>

      <Toaster />
    </div>
  );
}


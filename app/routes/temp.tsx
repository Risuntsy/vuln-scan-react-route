import { Button, errorToast, successToast, Tiptap, Toaster } from "#/components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "#/components";
import { useEffect, useState } from "react";
import { Form, useActionData, useSubmit, type ActionFunctionArgs, useFetcher } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  // const formData = await request.formData();
  return {
    success: true,
    message: "ok",
    data: await request.json()
  };
}

export default function TempPage() {
  const fetcher = useFetcher();

  const [content, setContent] = useState(``);

  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
      if (fetcher.data?.success) {
        successToast("操作成功");
      } else {
        errorToast(fetcher.data?.message || "操作失败");
      }
    }
  }, [fetcher.data]);

  return (
    <div className="h-screen w-screen">
      <div>
        <Tiptap content={content} onChange={setContent} />
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await fetcher.submit(
                  {
                    action: "test"
                  },
                  {
                    method: "post",
                    encType: "application/json"
                  }
                );
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
}

async function formAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  return Object.fromEntries(formData);
}

function TempForm() {
  const result = useActionData<typeof formAction>();
  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col h-full">
        <div>{JSON.stringify(result)}</div>
        <form method="post" className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="options" className="text-sm font-medium">
              Select Options
            </label>
            <select id="options" name="options" multiple className="w-full p-2 border rounded-md" size={4}>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
              <option value="option4">Option 4</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

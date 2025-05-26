import { Button } from "#/components";
import { Input } from "#/components";
import { Label } from "#/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components";
import { AlertCircle, Lock, User } from "lucide-react";
import { z } from "zod";
import { redirect, useActionData, useFetcher } from "react-router";
import { Alert, AlertDescription } from "#/components";
import { login } from "#/api";
import { tokenCookie, userCookie, getTokenAndUser } from "#/lib";
import { DASHBOARD_ROUTE } from "#/routes";
import type { Route } from "./+types/login";
import { APP_NAME } from "#/configs";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  redirect: z.string().optional()
});

export async function loader({ request }: Route.LoaderArgs) {
  const { token, user } = await getTokenAndUser(request);
  if (token && user) {
    return redirect(DASHBOARD_ROUTE);
  }
}

export async function action({ request }: Route.ActionArgs) {
  const { success, data, error } = loginSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!success) return { success: false, message: error.message };
  const { token, message } = await login(data);
  if (!token) return { success: false, message };
  return redirect(data.redirect || DASHBOARD_ROUTE, {
    headers: [
      ["Set-Cookie", await tokenCookie.serialize(token)],
      ["Set-Cookie", await userCookie.serialize(data.username)]
    ]
  });
}

export default function LoginPage() {
  const fetcher = useFetcher();

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <Card className="w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{APP_NAME}</CardTitle>
          <CardDescription className="text-center">请输入您的账号和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          {!fetcher.data?.success && fetcher.data?.message && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fetcher.data?.message}</AlertDescription>
            </Alert>
          )}
          <fetcher.Form method="post">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="请输入用户名"
                    className="pl-10"
                    required
                    defaultValue=""
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="请输入密码"
                    className="pl-10"
                    required
                    defaultValue=""
                  />
                </div>
              </div>
              <Button className="w-full" type="submit">
                登录
              </Button>
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}

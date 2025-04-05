import { Button } from "#/components";
import { Input } from "#/components";
import { Label } from "#/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components";
import { AlertCircle, Lock, User } from "lucide-react";
import { z } from "zod";
import { redirect, useActionData } from "react-router";
import { Alert, AlertDescription } from "#/components";
import { login } from "#/api";
import { tokenCookie, getToken } from "#/lib";
import { DASHBOARD_ROUTE } from "#/routes";
import type { Route } from "./+types/login";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  redirect: z.string().optional()
});

export async function loader({ request }: Route.LoaderArgs) {
  const token = await getToken(request, false);
  if (token) {
    return redirect(DASHBOARD_ROUTE);
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { success, data, error } = loginSchema.safeParse(Object.fromEntries(await request.formData()));

  if (!success) {
    return { success: false, message: error.message };
  }

  const { token } = await login(data);
  return redirect(data.redirect || DASHBOARD_ROUTE, {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(token)
    }
  });
}

export default function LoginPage() {
  const { success, message } = useActionData<typeof action>() || {};

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">漏洞扫描系统</CardTitle>
          <CardDescription className="text-center">请输入您的账号和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <form method="post">
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
                    defaultValue="ScopeSentry"
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
                    defaultValue="AJYvD7oJ"
                  />
                </div>
              </div>
              <Button className="w-full" type="submit">
                登录
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

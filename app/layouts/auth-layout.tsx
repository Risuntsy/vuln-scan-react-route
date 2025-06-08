import { getToken } from "#/lib";
import { type LoaderFunctionArgs, Outlet, redirect } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  if (!token) return redirect("/login");
}

export default function AuthLayout() {
  return <Outlet />;
}

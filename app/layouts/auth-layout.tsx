import { getToken } from "#/lib";
import { Outlet, redirect } from "react-router";
import type { Route } from "../+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  const token = await getToken(request);
  if (!token) {
    return redirect("/login");
  }
  return null;
}

export default function AuthLayout() {
  return <Outlet />;
}

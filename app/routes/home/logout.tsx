import { tokenCookie } from "#/lib";
import { LOGIN_ROUTE } from "#/routes";
import { redirect } from "react-router";

export async function loader() {
  return redirect(LOGIN_ROUTE, {
    headers: {
      "Set-Cookie": await tokenCookie.serialize(null, { maxAge: -1 })
    }
  });
}

export default function LogoutPage() {
  return null;
}

import { createCookie, redirect } from "react-router";

export const tokenCookie = createCookie("token", {
  maxAge: 604_800
});

export async function getToken(request: Request, redirectToLoginWhenMissing = true) {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await tokenCookie.parse(cookieHeader)) as string;

  if (!token && redirectToLoginWhenMissing) {
    throw redirect("/login");
  }
  return token;
}



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

export const userCookie = createCookie("user", {
  maxAge: 604_800
});

export async function getUser(request: Request, redirectToLoginWhenMissing = true) {
  const cookieHeader = request.headers.get("Cookie");
  const user = (await userCookie.parse(cookieHeader)) as string;

  if (!user && redirectToLoginWhenMissing) {
    tokenCookie.serialize(null, { maxAge: -1 });
    throw redirect("/login");
  }
  return user;
}

export async function getTokenAndUser(request: Request) {
  const [token, user] = await Promise.all([getToken(request, false), getUser(request, false)]);
  return { token, user };
}

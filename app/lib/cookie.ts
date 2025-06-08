import { checkKey } from "#/api";
import { createCookie, redirect, type Cookie } from "react-router";

const cookieConfig = {
  maxAge: 604_800
};

export const tokenCookie = createCookie("token", cookieConfig);
export const userCookie = createCookie("user", cookieConfig);
export const pluginKeyCookie = createCookie("pluginKey", cookieConfig);

export async function getCookieValue<T = string>(request: Request, cookie: Cookie): Promise<T | null> {
  const cookieHeader = request.headers.get("Cookie");
  const value = (await cookie.parse(cookieHeader)) as T;

  return value;
}

export async function getToken(request: Request, redirectToLoginWhenMissing = true) {
  const token = (await getCookieValue<string>(request, tokenCookie)) as string;
  if (!token && redirectToLoginWhenMissing) {
    throw redirect("/login");
  }
  return token;
}

export async function getUser(request: Request, redirectToLoginWhenMissing = true) {
  const user = await getCookieValue<string>(request, userCookie);

  if (!user && redirectToLoginWhenMissing) {
    tokenCookie.serialize(null, { maxAge: -1 });
    throw redirect("/login");
  }
  return user;
}

export async function getPluginKey(request: Request) {
  // const token = await getToken(request);
  const pluginKey = getCookieValue<string>(request, pluginKeyCookie);
  // if(!pluginKey) 
  // await checkKey({key: pluginKey, token})
  return pluginKey; 
}

export async function getTokenAndUser(request: Request) {
  const [token, user] = await Promise.all([getToken(request, false), getUser(request, false)]);
  return { token, user };
}

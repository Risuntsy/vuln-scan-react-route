import { LOGIN_ROUTE } from "#/routes";
import { redirect } from "react-router";
import { tokenCookie } from "#/lib";

export async function authResponseInterceptor(responseData: any): Promise<any> {
  // {"code":500,"message":"Not authenticated"}
  if (responseData?.code === 401 || (responseData?.code === 500 && responseData?.message === "Not authenticated")) {
    throw redirect(LOGIN_ROUTE, {
      headers: {
        "Set-Cookie": await tokenCookie.serialize("", { maxAge: -1 })
      }
    });
  }
  return responseData;
}

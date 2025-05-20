import { apiClient } from "#/lib";
import type { BaseRequest, BaseResponse } from "../common";
import type { LoginResponse } from "./entity";

export async function login(data: { username: string; password: string }) {
  const response = await apiClient.post<BaseResponse<LoginResponse>>("/user/login", data, {
    withCredentials: false,
    responseType: "object",
  });
  return { token: response.data ? `Bearer ${response.data.access_token}` : null, message: response.message };
}

export async function changePassword({ token, ...data }: { newPassword: string } & BaseRequest) {
  return apiClient.post("/user/changePassword", data, {
    headers: {
      Authorization: token
    }
  });
}

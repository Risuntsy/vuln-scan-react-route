import { apiClient } from "#/lib";

export async function login(data: { username: string; password: string }) {
  interface LoginResponse {
    access_token: string;
  }

  const response = await apiClient.post<LoginResponse>("/user/login", data, {
    withCredentials: false,
  });
  return { token: `Bearer ${response.access_token}` };
}

export async function changePassword(data: { newPassword: string }) {
  return apiClient.post("/user/changePassword", data, {
    withCredentials: true
  });
}

import { apiClient } from "#/lib";
import type { SensitiveData, SensitiveAddData, SensitiveUpdateData, SensitiveStateData } from "./entity";
import type { ListResponse, CommonMessage, BaseRequest } from "#/api";

export async function getSensitiveData({
  token,
  ...data
}: BaseRequest & { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<SensitiveData>>("/sensitive/data", data, {
    headers: {
      Authorization: `${token}`
    },
  });
}

export async function addSensitiveData({ token, ...data }: BaseRequest & SensitiveAddData) {
  return apiClient.post<CommonMessage>("/sensitive/add", data, {
    headers: {
      Authorization: `${token}`
    }
  });
}

export async function updateSensitiveData({ token, ...data }: BaseRequest & SensitiveUpdateData) {
  return apiClient.post<CommonMessage>("/sensitive/update", data, {
    headers: {
      Authorization: `${token}`
    }
  });
}

export async function deleteSensitiveData({ token, ...data }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>("/sensitive/delete", data, {
    headers: {
      Authorization: `${token}`
    }
  });
}

export async function updateSensitiveState({ token, ...data }: BaseRequest & SensitiveStateData) {
  return apiClient.post<CommonMessage>("/sensitive/update/state", data, {
    headers: {
      Authorization: `${token}`
    }
  });
}

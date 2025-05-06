import { apiClient } from "#/lib";
import type { FingerprintData, FingerprintAddData, FingerprintUpdateData } from "./entity";
import type { ListResponse, CommonMessage, BaseRequest } from "#/api";

export async function getFingerprintData({
  token,
  ...data
}: BaseRequest & { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<FingerprintData>>("/fingerprint/data", data, {
    headers: {
      Authorization: `${token}`
    },
  });
}

export async function addFingerprintData({ token, ...data }: BaseRequest & FingerprintAddData) {
  return apiClient.post<CommonMessage>("/fingerprint/add", data, {
    headers: {
      Authorization: `${token}`
    },
  });
}

export async function updateFingerprintData({ token, ...data }: BaseRequest & FingerprintUpdateData) {
  return apiClient.post<CommonMessage>("/fingerprint/update", data, {
    headers: {
      Authorization: `${token}`
    }
  });
}

export async function deleteFingerprintData({ token, ...data }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>("/fingerprint/delete", data, {
    headers: {
      Authorization: `${token}`
    }
  });
}

import { apiClient } from "#/lib";
import type { FingerprintData, FingerprintAddData, FingerprintUpdateData } from "./entity";
import type { ListResponse, CommonMessage } from "#/api";

export async function getFingerprintData(data: { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<FingerprintData>>("/fingerprint/data", data);
}

export async function addFingerprintData(data: FingerprintAddData) {
  return apiClient.post<CommonMessage>("/fingerprint/add", data);
}

export async function updateFingerprintData(data: FingerprintUpdateData) {
  return apiClient.post<CommonMessage>("/fingerprint/update", data);
}

export async function deleteFingerprintData(data: { ids: string[] }) {
  return apiClient.post<CommonMessage>("/fingerprint/delete", data);
}

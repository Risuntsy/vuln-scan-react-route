import { apiClient } from "#/lib";
import type { SensitiveData, SensitiveAddData, SensitiveUpdateData, SensitiveStateData } from "./entity";
import type { ListResponse, CommonMessage } from "#/api";

export async function getSensitiveData(data: { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<SensitiveData>>("/sensitive/data", data);
}

export async function addSensitiveData(data: SensitiveAddData) {
  return apiClient.post<CommonMessage>("/sensitive/add", data);
}

export async function updateSensitiveData(data: SensitiveUpdateData) {
  return apiClient.post<CommonMessage>("/sensitive/update", data);
}

export async function deleteSensitiveData(data: { ids: string[] }) {
  return apiClient.post<CommonMessage>("/sensitive/delete", data);
}

export async function updateSensitiveState(data: SensitiveStateData) {
  return apiClient.post<CommonMessage>("/sensitive/update/state", data);
}

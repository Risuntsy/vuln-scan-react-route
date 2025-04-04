import { apiClient } from "#/lib";
import type { PocData, PocContent, PocNameList, PocAddData, PocUpdateData } from "./entity";
import type { ListResponse, CommonMessage } from "#/api";

export async function getPocData(data: {
  search: string;
  pageIndex: number;
  pageSize: number;
  filter: Record<string, any>;
}) {
  return apiClient.post<ListResponse<PocData>>("/poc/data", data);
}

export async function getPocDataAll() {
  return apiClient.get<ListResponse<PocData>>("/poc/data/all");
}

export async function getPocNameList() {
  return apiClient.get<ListResponse<PocNameList>>("/poc/name/list");
}

export async function getPocContent(data: { id: string }) {
  return apiClient.post<PocContent>("/poc/content", data);
}

export async function getPocDetail(data: { id: string }) {
  return apiClient.post<PocData>("/poc/detail", data);
}

export async function addPocData(data: PocAddData) {
  return apiClient.post<CommonMessage>("/poc/add", data);
}

export async function updatePocData(data: PocUpdateData) {
  return apiClient.post<CommonMessage>("/poc/update", data);
}

export async function deletePocData(data: { ids: string[] }) {
  return apiClient.post<CommonMessage>("/poc/delete", data);
}

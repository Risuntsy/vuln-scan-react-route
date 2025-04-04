import { apiClient } from "#/lib";
import type { FileData, PortDictData } from "./entity";
import type { ListResponse, CommonMessage } from "#/api";

export async function getPortDictData(search: string, pageIndex: number, pageSize: number) {
  return apiClient.post<ListResponse<PortDictData>>("/dictionary/port/data", {
    search,
    pageIndex,
    pageSize
  });
}

export async function deletePortDictData(ids: string[]) {
  return apiClient.post<CommonMessage>("/dictionary/port/delete", { ids });
}

export async function upgradePortDictData(id: string, name: string, value: string) {
  return apiClient.post<CommonMessage>("/dictionary/port/upgrade", {
    id,
    name,
    value
  });
}

export async function addPortDictData(name: string, value: string) {
  return apiClient.post<CommonMessage>("/dictionary/port/add", {
    name,
    value
  });
}

export async function getManageList() {
  return apiClient.get<ListResponse<FileData>>("/dictionary/manage/list");
}

export async function createDict(formData: FormData) {
  return apiClient.post<CommonMessage>("/dictionary/manage/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export async function deleteDict(ids: string[]) {
  return apiClient.post<CommonMessage>("/dictionary/manage/delete", { ids });
}

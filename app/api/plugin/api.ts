import { apiClient } from "#/lib";
import type { PluginData, PluginLog, PluginDeleteItem, PluginSaveData, PluginOperationData } from "./entity";
import type { ListResponse, CommonMessage } from "#/api";

export async function getPluginData(data: { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/list", data);
}

export async function getPluginDetail(data: { id: string }) {
  return apiClient.post<PluginData>("/plugin/detail", data);
}

export async function savePluginData(data: PluginSaveData) {
  return apiClient.post<CommonMessage>("/plugin/save", data);
}

export async function deletePluginData(data: { data: PluginDeleteItem[] }) {
  return apiClient.post<CommonMessage>("/plugin/delete", data);
}

export async function checkKey(data: { key: string }) {
  return apiClient.post<PluginLog>("/plugin/key/check", data);
}

export async function getPluginLog(data: { module: string; hash: string }) {
  return apiClient.post<PluginLog>("/plugin/log", data);
}

export async function cleanPluginLog(data: { module: string; hash: string }) {
  return apiClient.post<PluginLog>("/plugin/log/clean", data);
}

export async function getPluginDataByModule(data: { module: string }) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/list/bymodule", data);
}

export async function reInstallPlugin(data: PluginOperationData) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/reinstall", data);
}

export async function reCheckPlugin(data: PluginOperationData) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/recheck", data);
}

export async function uninstallPlugin(data: PluginOperationData) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/uninstall", data);
}

import { apiClient } from "#/lib";
import type { PluginData, PluginLog, PluginDeleteItem, PluginSaveData, PluginOperationData } from "./entity";
import type { ListResponse, CommonMessage, BaseRequest } from "#/api";

export async function getPluginData({
  token,
  ...data
}: { search: string; pageIndex: number; pageSize: number } & BaseRequest) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/list", data, { headers: { Authorization: token } });
}

export async function getPluginDetail({ id, token }: { id: string } & BaseRequest) {
  return apiClient.post<PluginData>("/plugin/detail", { id }, { headers: { Authorization: token } });
}

export async function savePluginData({ token, ...data }: PluginSaveData & BaseRequest) {
  return apiClient.post<CommonMessage>("/plugin/save", data, { headers: { Authorization: token } });
}

export async function deletePluginData({ data, token }: { data: PluginDeleteItem[] } & BaseRequest) {
  return apiClient.post<CommonMessage>("/plugin/delete", { data }, { headers: { Authorization: token } });
}

export async function checkKey({ key, token }: { key: string } & BaseRequest) {
  return apiClient.post<PluginLog>("/plugin/key/check", { key }, { headers: { Authorization: token } });
}

export async function getPluginLog({ module, hash, token }: { module: string; hash: string } & BaseRequest) {
  return apiClient.post<PluginLog>("/plugin/log", { module, hash }, { headers: { Authorization: token } });
}

export async function cleanPluginLog({ module, hash, token }: { module: string; hash: string } & BaseRequest) {
  return apiClient.post<PluginLog>("/plugin/log/clean", { module, hash }, { headers: { Authorization: token } });
}

export async function getPluginDataByModule({ module, token }: { module: string } & BaseRequest) {
  return apiClient.post<ListResponse<PluginData>>(
    "/plugin/list/bymodule",
    { module },
    { headers: { Authorization: token } }
  );
}

// export async function getPluginDataByModules({ modules, token }: { modules: string[] } & BaseRequest) {
//   return modules.map(async (module) => await getPluginDataByModule({ module, token }));
// }

export async function reInstallPlugin({ token, ...data }: PluginOperationData & BaseRequest) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/reinstall", data, { headers: { Authorization: token } });
}

export async function reCheckPlugin({ token, ...data }: PluginOperationData & BaseRequest) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/recheck", data, { headers: { Authorization: token } });
}

export async function uninstallPlugin({ token, ...data }: PluginOperationData & BaseRequest) {
  return apiClient.post<ListResponse<PluginData>>("/plugin/uninstall", data, { headers: { Authorization: token } });
}

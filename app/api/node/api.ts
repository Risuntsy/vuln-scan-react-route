import { apiClient } from "#/lib";
import type { NodeData, NodeLog, PluginInfo, NodeConfigUpdateData } from "./entity";
import type { ListResponse, CommonMessage, BaseRequest } from "#/api";

export async function getNodeData({ token }: BaseRequest) {
  return apiClient.get<ListResponse<NodeData>>("/node/data", {
    headers: { Authorization: token }
  });
}

export async function restartNode({ token, name }: BaseRequest & { name: string }) {
  return apiClient.post<CommonMessage>(
    "/node/restart",
    { name },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getNodeDataOnline({ token }: BaseRequest) {
  return apiClient.get<ListResponse<string>>("/node/data/online", {
    headers: { Authorization: token }
  });
}

export async function updateNodeConfigData({ token, ...data }: BaseRequest & NodeConfigUpdateData) {
  return apiClient.post<ListResponse<NodeData>>("/node/config/update", data, {
    headers: { Authorization: token }
  });
}

export async function deleteNode({ token, names }: BaseRequest & { names: string[] }) {
  return apiClient.post<CommonMessage>(
    "/node/delete",
    { names },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getNodeLog({ token, name }: BaseRequest & { name: string }) {
  return apiClient.post<NodeLog>(
    "/node/log/data",
    { name },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getPluginInfo({ token, name }: BaseRequest & { name: string }) {
  return apiClient.post<ListResponse<PluginInfo>>(
    "/node/plugin",
    { name },
    {
      headers: { Authorization: token }
    }
  );
}

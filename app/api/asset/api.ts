import type { CommonMessage, ListResponse, BaseRequest } from "#/api";

import { apiClient } from "#/lib";

import type {
  AssetData,
  AssetStatistics,
  AssetDetail,
  SubdomainData,
  URLData,
  CrawlerData,
  SensitiveData,
  SensitiveBody,
  SensitiveNames,
  AssetChangeLog,
  AssetScreenshot,
  FilterRequest,
  IconStatisticsItem,
  StatisticsItem
} from "./entity";

export async function getAssetData({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<ListResponse<AssetData>>("/asset/data", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetCardData({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<ListResponse<AssetData>>("/asset/data/card", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetScreenshot({ id, token }: BaseRequest & { id: string }) {
  return apiClient.post<AssetScreenshot>(
    "/asset/screenshot",
    { id },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getAssetStatistics({ token, ...data }: BaseRequest & FilterRequest): Promise<{
  Port: StatisticsItem[];
  Service: StatisticsItem[];
  Icon: IconStatisticsItem[];
  Product: StatisticsItem[];
}> {
  const [portStatistic, typeStatistic, iconStatistic, appStatistic] = await Promise.all([
    getAssetStatisticsPort({ ...data, token }),
    getAssetStatisticsType({ ...data, token }),
    getAssetStatisticsIcon({ ...data, token }),
    getAssetStatisticsApp({ ...data, token })
  ]);

  return {
    Port: portStatistic.Port || [],
    Service: typeStatistic.Service || [],
    Icon: iconStatistic.Icon || [],
    Product: appStatistic.Product || []
  };
}

export async function getAssetStatisticsPort({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<AssetStatistics>("/asset/statistics/port", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetStatisticsType({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<AssetStatistics>("/asset/statistics/type", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetStatisticsIcon({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<AssetStatistics>("/asset/statistics/icon", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetStatisticsApp({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<AssetStatistics>("/asset/statistics/app", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetStatisticsTitle({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<AssetStatistics>("/asset/statistics/title", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetDetail({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<AssetDetail>("/asset/detail", data, {
    headers: { Authorization: token }
  });
}

export async function getAssetChangeLog({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<AssetChangeLog[]>("/asset/changelog", data, {
    headers: { Authorization: token }
  });
}

export async function updateStatus({ token, ...data }: BaseRequest & { id: string; tp: string; status: number }) {
  return apiClient.post<CommonMessage>("/data/update/status", data, {
    headers: { Authorization: token }
  });
}

export async function getSubdomainData({ data, token }: BaseRequest & { data: FilterRequest }) {
  return apiClient.post<ListResponse<SubdomainData>>("/subdomain/data", data, {
    headers: { Authorization: token }
  });
}

export async function getURLData({
  data,
  token
}: BaseRequest & { data: FilterRequest & { sort: Record<string, unknown> } }) {
  return apiClient.post<ListResponse<URLData>>("/url/data", data, {
    headers: { Authorization: token }
  });
}

export async function getCrawlerData({ data, token }: BaseRequest & { data: FilterRequest }) {
  return apiClient.post<ListResponse<CrawlerData>>("/crawler/data", data, {
    headers: { Authorization: token }
  });
}

export async function getSensitiveResultData({ data, token }: BaseRequest & { data: FilterRequest }) {
  return apiClient.post<ListResponse<SensitiveData>>("/sensitive/result/data2", data, {
    headers: { Authorization: token }
  });
}

export async function getSensitiveResultBody({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<SensitiveBody>("/sensitive/result/body", data, {
    headers: { Authorization: token }
  });
}

export async function getSensitiveNames({ token, ...data }: BaseRequest & FilterRequest) {
  return apiClient.post<ListResponse<SensitiveNames>>("/sensitive/result/names", data, {
    headers: { Authorization: token }
  });
}

export async function deleteData({ token, ...data }: BaseRequest & { ids: string[]; index: string }) {
  return apiClient.post<CommonMessage>("/data/delete", data, {
    headers: { Authorization: token }
  });
}

export async function addTag({ token, ...data }: BaseRequest & { id: string; tp: string; tag: string }) {
  return apiClient.post<CommonMessage>("/data/add/tag", data, {
    headers: { Authorization: token }
  });
}

export async function deleteTag({ token, ...data }: BaseRequest & { id: string; tp: string; tag: string }) {
  return apiClient.post<CommonMessage>("/data/delete/tag", data, {
    headers: { Authorization: token }
  });
}

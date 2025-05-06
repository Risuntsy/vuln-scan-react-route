import { apiClient } from "#/lib";
import type { PocData, PocContent, PocNameList, PocAddData, PocUpdateData } from "./entity";
import type { ListResponse, CommonMessage, BaseRequest } from "#/api";

export async function getPocData({ token, ...data }: BaseRequest & {
  search: string;
  pageIndex: number;
  pageSize: number;
  filter: Record<string, any>;
}) {
  return apiClient.post<ListResponse<PocData>>("/poc/data", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getPocDataAll({ token }: BaseRequest) {
  return apiClient.get<ListResponse<PocData>>("/poc/data/all", {
    headers: {
      Authorization: token
    }
  });
}

export async function getPocNameList({ token }: BaseRequest) {
  return apiClient.get<ListResponse<PocNameList>>("/poc/name/list", {
    headers: {
      Authorization: token
    }
  });
}

export async function getPocContent({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<PocContent>("/poc/content", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getPocDetail({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<PocData>("/poc/detail", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function addPocData({ token, ...data }: BaseRequest & PocAddData) {
  return apiClient.post<CommonMessage>("/poc/add", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function updatePocData({ token, ...data }: BaseRequest & PocUpdateData) {
  return apiClient.post<CommonMessage>("/poc/update", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function deletePocData({ token, ...data }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>("/poc/delete", data, {
    headers: {
      Authorization: token
    }
  });
}

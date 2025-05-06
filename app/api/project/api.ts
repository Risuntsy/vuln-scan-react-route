import { apiClient } from "#/lib";
import type {
  ProjectContent,
  ProjectDataResponse,
  ProjectAddData,
  ProjectUpdateData,
  ProjectInfo,
  ProjectAssetCount,
  ProjectVulLevel,
  VulData,
  SubdomainData,
  ProjectSearchData
} from "./entity";
import type { BaseRequest, CommonMessage, ListResponse } from "#/api";

export async function getProjectData({
  token,
  ...data
}: BaseRequest & { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ProjectDataResponse>("/project/data", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectAll({ token }: BaseRequest) {
  return apiClient.get<ProjectDataResponse>("/project/all", {
    headers: {
      Authorization: token
    }
  });
}

export async function addProjectData({ token, ...data }: BaseRequest & ProjectAddData) {
  return apiClient.post<CommonMessage>("/project/add", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function updateProjectData({ token, ...data }: BaseRequest & ProjectUpdateData) {
  return apiClient.post<CommonMessage>("/project/update", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectContent({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<ProjectContent>("/project/content", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function deleteProject({ token, ...data }: BaseRequest & { ids: string[]; delA: boolean }) {
  return apiClient.post<CommonMessage>("/project/delete", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectInfo({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<ProjectInfo>("/project_aggregation/project/info", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectAssetCount({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<ProjectAssetCount>("/project_aggregation/project/asset/count", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectVulLevelCount({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<ListResponse<ProjectVulLevel>>("/project_aggregation/project/vul/statistics", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectVulData({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<ListResponse<VulData>>("/project_aggregation/project/vul/data", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectSubdomainData({ token, ...data }: BaseRequest & ProjectSearchData) {
  return apiClient.post<ListResponse<SubdomainData>>("/project_aggregation/project/subdomain/data", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectPortData({ token, ...data }: BaseRequest & ProjectSearchData) {
  return apiClient.post<ListResponse<SubdomainData>>("/project_aggregation/project/port/data", data, {
    headers: {
      Authorization: token
    }
  });
}

export async function getProjectServiceData({ token, ...data }: BaseRequest & ProjectSearchData) {
  return apiClient.post<ListResponse<SubdomainData>>("/project_aggregation/project/service/data", data, {
    headers: {
      Authorization: token
    }
  });
}

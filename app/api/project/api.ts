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
import type { CommonMessage, ListResponse } from "#/api";

export async function getProjectData(data: { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ProjectDataResponse>("/project/data", data);
}

export async function getProjectAll() {
  return apiClient.get<ProjectDataResponse>("/project/all");
}

export async function addProjectData(data: ProjectAddData) {
  return apiClient.post<CommonMessage>("/project/add", data);
}

export async function updateProjectData(data: ProjectUpdateData) {
  return apiClient.post<CommonMessage>("/project/update", data);
}

export async function getProjectContent(data: { id: string }) {
  return apiClient.post<ProjectContent>("/project/content", data);
}

export async function deleteProject(data: { ids: string[]; delA: boolean }) {
  return apiClient.post<CommonMessage>("/project/delete", data);
}

export async function getProjectInfo(data: { id: string }) {
  return apiClient.post<ProjectInfo>("/project_aggregation/project/info", data);
}

export async function getProjectAssetCount(data: { id: string }) {
  return apiClient.post<ProjectAssetCount>("/project_aggregation/project/asset/count", data);
}

export async function getProjectVulLevelCount(data: { id: string }) {
  return apiClient.post<ListResponse<ProjectVulLevel>>("/project_aggregation/project/vul/statistics", data);
}

export async function getProjectVulData(data: { id: string }) {
  return apiClient.post<ListResponse<VulData>>("/project_aggregation/project/vul/data", data);
}

export async function getProjectSubdomainData(data: ProjectSearchData) {
  return apiClient.post<ListResponse<SubdomainData>>("/project_aggregation/project/subdomain/data", data);
}

export async function getProjectPortData(data: ProjectSearchData) {
  return apiClient.post<ListResponse<SubdomainData>>("/project_aggregation/project/port/data", data);
}

export async function getProjectServiceData(data: ProjectSearchData) {
  return apiClient.post<ListResponse<SubdomainData>>("/project_aggregation/project/service/data", data);
}

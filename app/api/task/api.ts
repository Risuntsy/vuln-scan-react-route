import { apiClient } from "#/lib";
import type { CommonMessage, ListResponse } from "#/api";
import type {
  TaskData,
  AddTaskRequest,
  UpdateScheduleRequest,
  TaskDetail,
  TaskProgessInfo,
  ScheduledTaskData,
  TemplateDetail,
  TaskTemplateData,
  AddScheduledTaskRequest
} from "./entity";

type BaseRequest = {
  token: string;
};

export async function getTaskData({
  search,
  pageIndex,
  pageSize,
  token
}: BaseRequest & {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}) {
  return apiClient.post<ListResponse<TaskData>>(
    "/task/data",
    { search, pageIndex, pageSize },
    { headers: { Authorization: token } }
  );
}

export async function stopTask({ token, ...data }: BaseRequest & { ids: Array<string>; delA?: boolean }) {
  return apiClient.post<ListResponse<TaskData>>("/task/stop", data, { headers: { Authorization: token } });
}

export async function startTask({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<ListResponse<TaskData>>("/task/start", data, { headers: { Authorization: token } });
}

export async function addTask({ token, ...data }: BaseRequest & AddTaskRequest) {
  return apiClient.post<CommonMessage>("/task/add", data, {
    headers: { Authorization: token },
    // enableLog: true
  });
}

export async function getTaskDetail({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<TaskDetail>("/task/detail", data, { headers: { Authorization: token } });
}

export async function getScheduleTaskDetail({ id, token }: BaseRequest & { id: string }) {
  return apiClient.post<TaskDetail>("/task/scheduled/detail", { id }, { headers: { Authorization: token } });
}

export async function deleteTask({ token, ...data }: BaseRequest & { ids: string[]; delA: boolean }) {
  return apiClient.post<CommonMessage>("/task/delete", data, { headers: { Authorization: token } });
}

export async function retestTask({ token, ...data }: BaseRequest & { id: string }) {
  return apiClient.post<CommonMessage>("/task/retest", data, { headers: { Authorization: token } });
}

export async function getTaskProgress({
  id,
  pageIndex,
  pageSize,
  token
}: BaseRequest & { id: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<TaskProgessInfo>>(
    "/task/progress/info",
    { id, pageIndex, pageSize },
    { headers: { Authorization: token } }
  );
}

export async function getScheduledTaskData({
  search,
  pageIndex,
  pageSize,
  token
}: BaseRequest & { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<ScheduledTaskData>>(
    "/task/scheduled/data",
    { search, pageIndex, pageSize },
    { headers: { Authorization: token } }
  );
}

export async function runScheduledTask({ id, token }: BaseRequest & { id: string }) {
  return apiClient.post<CommonMessage>("/task/scheduled/run", { id }, { headers: { Authorization: token } });
}

export async function deleteScheduledTask({ ids, token }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>("/task/scheduled/delete", { ids }, { headers: { Authorization: token } });
}

export async function getScheduledTaskPageMonitData({
  search,
  pageIndex,
  pageSize,
  token
}: BaseRequest & { search: string; pageIndex: number; pageSize: number }) {
  return apiClient.post<ListResponse<ScheduledTaskData>>(
    "/task/scheduled/pagemonit/data",
    { search, pageIndex, pageSize },
    { headers: { Authorization: token } }
  );
}

export async function deleteScheduledTaskPageMonit({ ids, token }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>(
    "/task/scheduled/pagemonit/delete",
    { ids },
    { headers: { Authorization: token } }
  );
}

export async function updateScheduledTaskPageMonit({
  token,
  ...data
}: BaseRequest & {
  id: string;
  hour: number;
  node: string[];
  allNode: boolean;
}) {
  return apiClient.post<CommonMessage>("/task/scheduled/pagemonit/update", data, { headers: { Authorization: token } });
}

export async function addScheduledTaskPageMonit({ url, token }: BaseRequest & { url: string }) {
  return apiClient.post<CommonMessage>("/task/scheduled/pagemonit/add", { url }, { headers: { Authorization: token } });
}

export async function getTemplateData({
  search = "",
  pageIndex = 1,
  pageSize = 1000,
  token
}: BaseRequest & {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
}) {
  return apiClient.post<ListResponse<TaskTemplateData>>(
    "/task/template/list",
    { search, pageIndex, pageSize },
    { headers: { Authorization: token } }
  );
}

export async function getTemplateDetail({ id, token }: BaseRequest & { id: string }) {
  return apiClient.post<TemplateDetail>("/task/template/detail", { id }, { headers: { Authorization: token } });
}

export async function saveTemplateDetail({ token, ...data }: BaseRequest & { result: TemplateDetail; id?: string }) {
  return apiClient.post<TemplateDetail>("/task/template/save", data, {
    headers: { Authorization: token }
  });
}

export async function deleteTemplateDetail({ ids, token }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>("/task/template/delete", { ids }, { headers: { Authorization: token } });
}

export async function addScheduledTask({ token, ...data }: BaseRequest & AddScheduledTaskRequest) {
  return apiClient.post<CommonMessage>("/task/scheduled/add", data, { headers: { Authorization: token } });
}

export async function updateScheduleTask({ token, ...data }: BaseRequest & UpdateScheduleRequest) {
  return apiClient.post<CommonMessage>("/task/scheduled/update", data, {
    headers: { Authorization: token }
  });
}

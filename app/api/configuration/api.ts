import { apiClient } from "#/lib";
import type { ListResponse, CommonMessage, BaseRequest } from "#/api";
import type {
  NotificationConfig,
  NotificationSetting,
  DeduplicationConfig,
  UpdateDeduplicationRequest,
  AddNotificationRequest,
  UpdateNotificationRequest,
  SystemConfig,
  SubfinderConfig,
  RadConfig
} from "./entity";

export async function getSubfinderConfiguration({ token }: BaseRequest) {
  return apiClient.get<SubfinderConfig>("/configuration/subfinder/data", {
    headers: { Authorization: token }
  });
}

export async function saveSubfinderConfiguration({ token, ...data }: BaseRequest & { content: string }) {
  return apiClient.post<CommonMessage>("/configuration/subfinder/save", data, {
    headers: { Authorization: token }
  });
}

export async function getRadConfiguration({ token }: BaseRequest) {
  return apiClient.get<RadConfig>("/configuration/rad/data", {
    headers: { Authorization: token }
  });
}

export async function saveRadConfiguration({ token, ...data }: BaseRequest & { content: string }) {
  return apiClient.post<CommonMessage>("/configuration/rad/save", data, {
    headers: { Authorization: token }
  });
}

export async function getSystemConfiguration({ token }: BaseRequest) {
  return apiClient.get<SystemConfig>("/configuration/system/data", {
    headers: { Authorization: token }
  });
}

export async function saveSystemConfiguration({
  token,
  ...data
}: BaseRequest & { timezone: string; ModulesConfig: string }) {
  return apiClient.post<CommonMessage>("/configuration/system/save", data, {
    headers: { Authorization: token }
  });
}

export async function getNotifications({ token }: BaseRequest) {
  return apiClient.get<ListResponse<NotificationConfig>>("/notification/data", {
    headers: { Authorization: token }
  });
}

export async function addNotification({ token, ...data }: BaseRequest & AddNotificationRequest) {
  return apiClient.post<CommonMessage>("/notification/add", data, {
    headers: { Authorization: token }
  });
}

export async function updateNotification({ token, ...data }: BaseRequest & UpdateNotificationRequest) {
  return apiClient.post<CommonMessage>("/notification/update", data, {
    headers: { Authorization: token }
  });
}

export async function deleteNotifications({ token, ...data }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>("/notification/delete", data, {
    headers: { Authorization: token }
  });
}

export async function getNotificationSettings({ token }: BaseRequest) {
  return apiClient.get<NotificationSetting>("/notification/config/data", {
    headers: { Authorization: token }
  });
}

export async function updateNotificationSettings({ token, ...data }: BaseRequest & NotificationSetting) {
  return apiClient.post<CommonMessage>("/notification/config/update", data, {
    headers: { Authorization: token }
  });
}

export async function getDeduplicationConfig({ token }: BaseRequest) {
  return apiClient.get<DeduplicationConfig>("/configuration/deduplication/config", {
    headers: { Authorization: token }
  });
}

export async function updateDeduplicationConfig({ token, ...data }: BaseRequest & UpdateDeduplicationRequest) {
  return apiClient.post<CommonMessage>("/configuration/deduplication/save", data, {
    headers: { Authorization: token }
  });
}

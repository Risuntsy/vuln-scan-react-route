import { apiClient } from "#/lib";
import type { ListResponse, CommonMessage, BaseRequest } from "#/api";
import type {
  NotificationConfig,
  NotificationSetting,
  DeduplicationConfig,
  UpdateDeduplicationRequest,
  AddNotificationRequest,
  UpdateNotificationRequest
} from "./entity";

export async function getSubfinderConfiguration({ token }: BaseRequest) {
  return apiClient.get<string>("/configuration/subfinder/data", {
    headers: { Authorization: token }
  });
}

export async function saveSubfinderConfiguration({ content, token }: BaseRequest & { content: string }) {
  return apiClient.post<CommonMessage>(
    "/configuration/subfinder/save",
    { content },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getRadConfiguration({ token }: BaseRequest) {
  return apiClient.get<string>("/configuration/rad/data", {
    headers: { Authorization: token }
  });
}

export async function saveRadConfiguration({ content, token }: BaseRequest & { content: string }) {
  return apiClient.post<CommonMessage>(
    "/configuration/rad/save",
    { content },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getSystemConfiguration({ token }: BaseRequest) {
  return apiClient.get<string>("/configuration/system/data", {
    headers: { Authorization: token }
  });
}

export async function saveSystemConfiguration({
  timezone,
  ModulesConfig,
  token
}: BaseRequest & { timezone: string; ModulesConfig: string }) {
  return apiClient.post<CommonMessage>(
    "/configuration/system/save",
    {
      timezone,
      ModulesConfig
    },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getNotifications({ token }: BaseRequest) {
  return apiClient.get<ListResponse<NotificationConfig>>("/notification/data", {
    headers: { Authorization: token }
  });
}

export async function addNotification({ data, token }: BaseRequest & { data: AddNotificationRequest }) {
  return apiClient.post<CommonMessage>("/notification/add", data, {
    headers: { Authorization: token }
  });
}

export async function updateNotification({ data, token }: BaseRequest & { data: UpdateNotificationRequest }) {
  return apiClient.post<CommonMessage>("/notification/update", data, {
    headers: { Authorization: token }
  });
}

export async function deleteNotifications({ ids, token }: BaseRequest & { ids: string[] }) {
  return apiClient.post<CommonMessage>(
    "/notification/delete",
    { ids },
    {
      headers: { Authorization: token }
    }
  );
}

export async function getNotificationSettings({ token }: BaseRequest) {
  return apiClient.get<NotificationSetting>("/notification/config/data", {
    headers: { Authorization: token }
  });
}

export async function updateNotificationSettings({ settings, token }: BaseRequest & { settings: NotificationSetting }) {
  return apiClient.post<CommonMessage>("/notification/config/update", settings, {
    headers: { Authorization: token }
  });
}

export async function getDeduplicationConfig({ token }: BaseRequest) {
  return apiClient.get<DeduplicationConfig>("/configuration/deduplication/config", {
    headers: { Authorization: token }
  });
}

export async function updateDeduplicationConfig({ data, token }: BaseRequest & { data: UpdateDeduplicationRequest }) {
  return apiClient.post<CommonMessage>("/configuration/deduplication/save", data, {
    headers: { Authorization: token }
  });
}

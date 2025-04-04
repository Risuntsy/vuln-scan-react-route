import { apiClient } from "#/lib";
import type { AssetStatisticsResponse, UserAccessSource, WeeklyUserActivity, MonthlySales, VersionData } from "./entity";
import type { ListResponse, BaseRequest } from "#/api";

export async function getOverallAssetStatistics({ token }: BaseRequest) {
  return apiClient.get<AssetStatisticsResponse>("/asset/statistics/data", {
    headers: {
      Authorization: token
    }
  });
}

export async function getVersionData({ token }: BaseRequest) {
  return apiClient.get<ListResponse<VersionData>>("/system/version", {
    headers: {
      Authorization: token
    }
  });
}

export async function updateSystem({
  token,
  server,
  scan,
  key
}: BaseRequest & {
  server: string;
  scan: string;
  key: string;
}) {
  return apiClient.post<ListResponse<VersionData>>(
    "/system/update",
    { server, scan, key },
    {
      headers: {
        Authorization: token
      }
    }
  );
}

export async function getUserAccessSource({ token }: BaseRequest) {
  return apiClient.get<ListResponse<UserAccessSource>>("/analysis/userAccessSource", {
    headers: {
      Authorization: token
    }
  });
}

export async function getWeeklyUserActivity({ token }: BaseRequest) {
  return apiClient.get<ListResponse<WeeklyUserActivity>>("/analysis/weeklyUserActivity", {
    headers: {
      Authorization: token
    }
  });
}

export async function getMonthlySales({ token }: BaseRequest) {
  return apiClient.get<ListResponse<MonthlySales>>("/analysis/monthlySales", {
    headers: {
      Authorization: token
    }
  });
}

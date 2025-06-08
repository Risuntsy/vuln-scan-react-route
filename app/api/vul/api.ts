import { apiClient } from "#/lib";
import type { VulResultData, VulSearchData } from "./entity";
import type { ListResponse } from "#/api";

export async function getVulResultData({token, ...data}: VulSearchData & { token: string }) {
  data.filter.task && delete data.filter.task;
  return apiClient.post<ListResponse<VulResultData>>("/vul/data", data, {
    headers: {
      Authorization: token,
    },
    // enableLog: true
  });
}

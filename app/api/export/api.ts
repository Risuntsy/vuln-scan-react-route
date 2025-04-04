import { apiClient } from "#/lib";
import type { ExportField, ExportRecord } from "./entity";
import type { ListResponse, CommonMessage } from "#/api";

export async function exportData(data: {
  index: string;
  quantity: number;
  type: string;
  search: string;
  filter: Record<string, any>;
  field: string[];
  filetype: string;
}) {
  return apiClient.post<CommonMessage>("/export", data);
}

export async function getExportRecord() {
  return apiClient.get<ListResponse<ExportRecord>>("/export/record");
}

export async function deleteExport(data: { ids: string[] }) {
  return apiClient.post<CommonMessage>("/export/delete", data);
}

export async function getField(data: { index: string }) {
  return apiClient.post<ExportField>("/getfield", data);
}

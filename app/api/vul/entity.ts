export interface VulResultData {
  id: string;
  url: string;
  vulname: string;
  level: string;
  time: string;
  matched: string;
}

export interface VulSearchData {
  search: string;
  pageIndex: number;
  pageSize: number;
  filter: Record<string, any>;
}

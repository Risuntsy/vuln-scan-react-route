export interface VulResultData {
  id: string;
  url: string;
  vulnerability: string;
  vulnid: string;
  matched: string;
  time: string;
  request: string;
  response: string;
  level: string;
  status: number;
  tags: any;
}

export interface VulSearchData {
  search: string;
  pageIndex: number;
  pageSize: number;
  filter: Record<string, any>;
}

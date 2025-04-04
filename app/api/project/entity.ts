export interface ProjectData {
  id: string;
  name: string;
  logo: string;
  AssetCount: number;
  tag: string;
}

export interface ProjectContent {
  name: string;
  tag: string;
  target: string;
  ignore: string;
  logo: string;
  scheduledTasks: boolean;
  allNode: boolean;
  node: string[];
  duplicates: string;
  hour: number;
  template: string;
}

export interface ProjectDataResponse {
  result: { [key: string]: ProjectData[] };
  tag: { [key: string]: number };
}

export interface ProjectAddData {
  runNow: boolean;
  name: string;
  tag: string;
  target: string;
  logo: string;
  scheduledTasks: boolean;
  hour: number;
  allNode: boolean;
  node: string[];
  duplicates: string;
  ignore: string;
  template: string;
}

export interface ProjectUpdateData extends ProjectAddData {
  id: string;
}

export interface ProjectInfo {
  name: string;
  tag: string;
  scheduledTasks: boolean;
  hour: number;
  AssetCount: number;
  root_domains: string[];
  next_time: string;
}

export interface ProjectAssetCount {
  subdomainCount: number;
  vulCount: number;
}

export interface ProjectVulLevel {
  _id: string;
  count: number;
}

export interface VulData {
  url: string;
  vulname: string;
  level: string;
  time: string;
  matched: string;
}

export interface SubdomainData {
  id: string;
  host: string;
  type: string;
  value: string[];
  ip: string[];
  time: string;
}

export interface ProjectSearchData {
  search: string;
  filter: Record<string, any>;
  fq: Record<string, any>;
}

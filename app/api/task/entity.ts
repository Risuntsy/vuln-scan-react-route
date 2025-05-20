export type TemplateDetail = {
  id?: string;
  name: string;
  Parameters: {
    TargetHandler: Record<string, string>;
    SubdomainScan: Record<string, string>;
    SubdomainSecurity: Record<string, string>;
    PortScanPreparation: Record<string, string>;
    PortScan: Record<string, string>;
    PortFingerprint: Record<string, string>;
    AssetMapping: Record<string, string>;
    AssetHandle: Record<string, string>;
    URLScan: Record<string, string>;
    WebCrawler: Record<string, string>;
    URLSecurity: Record<string, string>;
    DirScan: Record<string, string>;
    VulnerabilityScan: Record<string, string>;
    PassiveScan: Record<string, string>;
  };
  TargetHandler: string[];
  SubdomainScan: string[];
  SubdomainSecurity: string[];
  PortScanPreparation: string[];
  PortScan: string[];
  PortFingerprint: string[];
  AssetMapping: string[];
  AssetHandle: string[];
  URLScan: string[];
  WebCrawler: string[];
  URLSecurity: string[];
  DirScan: string[];
  VulnerabilityScan: string[];
  PassiveScan: string[];
  vullist: string[];
};

export interface ScheduledTaskData {
  id: string;
  name: string;
  type: string;
  lastTime: string;
  nextTime: string;
  state: boolean;
  node: string[];
  cycle: string;
  allNode: boolean;
  runner_id: string;
  project: string[];
  targetSource: string;
  day: number;
  minute: number;
  hour: number;
  search: string;
  cycleType: "daily" | "nhours";
  scheduledTasks: boolean;
}

export interface TaskProgessInfo {
  TargetHandler: string[];
  SubdomainScan: string[];
  SubdomainSecurity: string[];
  PortScanPreparation: string[];
  PortScan: string[];
  PortFingerprint: string[];
  AssetMapping: string[];
  AssetHandle: string[];
  URLScan: string[];
  WebCrawler: string[];
  URLSecurity: string[];
  DirScan: string[];
  VulnerabilityScan: string[];
  PassiveScan: string[];
  All: string[];
  target: string;
  node: string;
}

export interface TaskDetail {
  name: string;
  target: string;
  ignore: string;
  node: string[];
  allNode: boolean;
  scheduledTasks: boolean;
  hour: number;
  duplicates: string;
  template: string;
  state: boolean;
}

export interface AddScheduledTaskRequest {
  name: string;
  target: string;
  ignore: string;
  node: string[];
  allNode: boolean;
  duplicates: string;
  scheduledTasks: boolean;
  hour: number;
  template: string;
  targetTp: string;
  search: string;
  filter: Record<string, any>;
  targetNumber: number;
  targetIds: string[];
  project: string[];
  targetSource: string;
  day: number;
  minute: number;
  week: number;
  bindProject: string | null;
  cycleType: string;
}

export interface UpdateScheduleRequest {
  id: string;
  name: string;
  target: string;
  ignore: string;
  node: string[];
  allNode: boolean;
  duplicates: string;
  scheduledTasks: boolean;
  hour: number;
  template: string;
  targetTp: string;
  search: string;
  filter: Record<string, any>;
  targetNumber: number;
  targetIds: string[];
  project: string[];
  targetSource: string;
  day: number;
  minute: number;
  week: number;
  bindProject: string | null;
  cycleType: string;
}

export interface AddTaskRequest {
  cycleType: "daily";
  name: string;
  target: string;
  ignore: string;
  node: string[];
  allNode: boolean;
  duplicates: "None" | "subdomain";
  scheduledTasks: boolean;
  // 监控周期
  hour: number;
  template: string;
  tp: string;
  targetTp: string;
  search: string;
  filter: Record<string, any>;
  targetNumber: number;
  targetIds: string[];
}

export interface TaskData {
  id: string;
  name: string;
  taskNum: string;
  progress: string;
  creatTime: string;
  endTime: string;
  status: number;
}

export interface TaskTemplateData {
  id: string;
  name: string;
}

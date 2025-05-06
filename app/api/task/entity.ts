export interface TemplateDetail {
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
  vullist: string[];
}

export interface ScheduledTaskData {
  ID: string;
  name: string;
  taskType: string;
  lastTime: string;
  nextTime: string;
  state: string;
  cycle?: number;
  node?: string[];
  allNode?: boolean;
  runner_id?: string;
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

export interface UpdateScheduleRequest {
  state: boolean;
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
}

export interface AddTaskRequest {
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
}

export interface TaskTemplateData {
  id: string;
  name: string;
}

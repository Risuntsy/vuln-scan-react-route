export interface NodeData {
  name: string;
  running: number;
  finished: number;
  state: number;
  cpuNum: number;
  memNum: number;
  updateTime: string;
  maxTaskNum: string;
  urlThread: string;
  urlMaxNum: string;
}

export interface NodeLog {
  code: string;
  logs: string;
}

export interface PluginInfo {
  name: string;
  install: number;
  check: number;
}

export interface NodeConfigUpdateData {
  oldName: string;
  name: string;
  ModulesConfig: string;
  state: boolean;
}

export interface NodeData {
  state: string;
  version: string;
  updateTime: string;
  cpuNum: string;
  memNum: string;
  maxTaskNum: string;
  running: number;
  finished: string;
  name: string;
  modulesConfig?: string;
  TotleMem?: string;
}

export interface ModulesConfig {
  maxGoroutineCount: number;
  subdomainScan: {
    goroutineCount: number;
  };
  subdomainSecurity: {
    goroutineCount: number;
  };
  assetMapping: {
    goroutineCount: number;
  };
  assetHandle: {
    goroutineCount: number;
  };
  portScanPreparation: {
    goroutineCount: number;
  };
  portScan: {
    goroutineCount: number;
  };
  portFingerprint: {
    goroutineCount: number;
  };
  URLScan: {
    goroutineCount: number;
  };
  URLSecurity: {
    goroutineCount: number;
  };
  webCrawler: {
    goroutineCount: number;
  };
  dirScan: {
    goroutineCount: number;
  };
  vulnerabilityScan: {
    goroutineCount: number;
  };
}

export interface NodeLog {
  code: string;
  logs: string;
}

export interface PluginInfo {
  name: string;
  install: string;
  check: string;
  hash: string;
  module: string;
}

export interface NodeConfigUpdateData {
  oldName: string;
  name: string;
  ModulesConfig: string;
  state: boolean;
}

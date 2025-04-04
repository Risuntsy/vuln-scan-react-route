export interface PluginData {
  id: string;
  module: string;
  version: string;
  name: string;
  hash: string;
  parameter: string;
  help: string;
  introduction: string;
  isSystem: boolean;
  source: string;
}

export interface PluginLog {
  code: string;
  logs: string;
}

export interface PluginDeleteItem {
  hash: string;
  module: string;
}

export interface PluginSaveData {
  id: string;
  name: string;
  version: string;
  module: string;
  parameter: string;
  help: string;
  introduction: string;
  source: string;
  key: string;
}

export interface PluginOperationData {
  node: string;
  hash: string;
  module: string;
}

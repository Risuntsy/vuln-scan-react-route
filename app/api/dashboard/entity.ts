export interface AssetStatisticsResponse {
  asetCount: number;
  subdomainCount: number;
  sensitiveCount: number;
  urlCount: number;
  vulnerabilityCount: number;
}

export interface VersionData {
  name: string;
  cversion: string;
  lversion: string;
  msg: string;
}

export interface UserAccessSource {
  value: number;
  name: string;
}

export interface WeeklyUserActivity {
  value: number;
  name: string;
}

export interface MonthlySales {
  name: string;
  estimate: number;
  actual: number;
}

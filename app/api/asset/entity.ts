export interface AssetData {
  id: string;
  domain: string;
  host: string;
  ip: string;
  port: number;
  service: string;
  title: string;
  status: number;
  banner: string;
  products: string[];
  time: string;
  icon: string;
  screenshot: string;
  type: string;
  statuscode: number;
  url: string;
  body: string;
}

export interface AssetDetailData extends AssetData {
  lastScanTime: string;
  tls: null | Record<string, unknown>;
  hash: Record<string, unknown>;
  cdnname: string;
  error: string;
  faviconmmh3: string; 
  faviconpath: string;
  rawheaders: string;
  jarm: string;
  technologies: string[];
  contentlength: number;
  cdn: boolean;
  webcheck: boolean;
  project: string;
  iconcontent: string;
  taskName: string[];
  webServer: string;
  rootDomain: string;
  tags: null | string[];
}


export interface AssetScreenshot {
  screenshot: string;
}

export interface StatisticsItem {
  value: string | number;
  number: number;
  href?: string;
}

export interface IconStatisticsItem extends StatisticsItem {
  icon_hash: string;
}

export interface AssetStatistics {
  Port?: StatisticsItem[];
  Service?: StatisticsItem[];
  Product?: StatisticsItem[];
  Icon?: IconStatisticsItem[];
  Title?: StatisticsItem[];
}

export interface AssetDetail {
  json: AssetDetailData;
}

export interface AssetChangeLogField {
  fieldname: string;
  old: string;
  new: string;
}

export interface AssetChangeLog {
  timestamp: string;
  isExpanded: boolean;
  change: AssetChangeLogField[];
}

export interface SubdomainData {
  id: string;
  host: string;
  type: string;
  value: string[];
  ip: string[];
  time: string;
}

export interface URLData {
  ID: string;
  URL: string;
  Source: string;
  Type: string;
  Input: string;
  Time: string;
}

export interface CrawlerData {
  ID: string;
  Method: string;
  URL: string;
  GetParameter: string;
  PostParameter: string;
  Time: string;
}

export interface SensitiveData {
  ID: string;
  url: string;
  color: string;
  name: string;
  time: string;
  body: string;
  match: string[];
}

export interface SensitiveNames {
  color: string;
  name: string;
  count: number;
}

export interface SensitiveBody {
  body: string;
}

export interface DirScanData {
  ID: string;
  URL: string;
  Title: string;
  Status: string;
  Length: string;
  Time: string;
}

export interface PageMonitoringData {
  ID: string;
  URL: string;
  OldResponseBodyMD5: string;
  CurrentResponseBodyMD5: string;
  Time: string;
}

export interface SubdomaintakerData {
  host: string;
  type: string;
  value: string;
  response: string;
}

export interface PageMResponse {
  hash: string;
  content: string;
}

export interface PageMHistory {
  diff: string[];
}

export interface FilterRequest {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  filter?: Record<string, any>;
}

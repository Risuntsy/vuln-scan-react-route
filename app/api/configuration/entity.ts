export interface NotificationConfig {
  method: string;
  url: string;
  contentType: string;
  data: string;
}

export interface NotificationSetting {
  dirScanNotification: boolean;
  portScanNotification: boolean;
  sensitiveNotification: boolean;
  subdomainNotification: boolean;
  subdomainTakeoverNotification: boolean;
  pageMonNotification: boolean;
  vulNotification: boolean;
}

export interface DeduplicationConfig {
  asset: boolean;
  subdomain: boolean;
  SubdoaminTakerResult: boolean;
  UrlScan: boolean;
  crawler: boolean;
  SensitiveResult: boolean;
  DirScanResult: boolean;
  vulnerability: boolean;
  PageMonitoring: boolean;
  hour: number;
  flag: boolean;
  next_run_time: string;
}

export interface UpdateDeduplicationRequest {
  asset: boolean;
  subdomain: boolean;
  SubdoaminTakerResult: boolean;
  UrlScan: boolean;
  crawler: boolean;
  SensitiveResult: boolean;
  DirScanResult: boolean;
  vulnerability: boolean;
  PageMonitoring: boolean;
  hour: number;
  flag: boolean;
  runNow: boolean;
}

export interface AddNotificationRequest {
  name: string;
  url: string;
  method: string;
  contentType: string;
  data: string;
  state: boolean;
}

export interface UpdateNotificationRequest extends AddNotificationRequest {
  id: string;
}

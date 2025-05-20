export const assetData = [
  { category: "Web Servers", count: 245, percentage: 46.58 },
  { category: "Databases", count: 85, percentage: 16.16 },
  { category: "API Endpoints", count: 85, percentage: 16.16 },
  { category: "Cloud Services", count: 69, percentage: 13.12 },
  { category: "IoT Devices", count: 22, percentage: 4.18 },
  { category: "Others", count: 20, percentage: 3.8 },
]

export const vulnerabilityStats = {
  total: 276,
  unconfirmed: 193,
  fixed: 38,
}

export const vulnerabilityTrendData = [
  { month: "1月", critical: 5, high: 12, medium: 18 },
  { month: "2月", critical: 8, high: 15, medium: 22 },
  { month: "3月", critical: 12, high: 28, medium: 45 },
  { month: "4月", critical: 42, high: 95, medium: 138 },
  { month: "5月", critical: 25, high: 68, medium: 92 },
  { month: "6月", critical: 10, high: 25, medium: 35 },
  { month: "7月", critical: 8, high: 18, medium: 24 },
  { month: "8月", critical: 6, high: 14, medium: 20 },
  { month: "9月", critical: 7, high: 16, medium: 22 },
  { month: "10月", critical: 9, high: 20, medium: 28 },
  { month: "11月", critical: 11, high: 24, medium: 32 },
  { month: "12月", critical: 14, high: 30, medium: 40 },
]

export const nodeData = [
  { id: "node-001", status: "online", tasks: 12, cpu: 45, memory: 62 },
  { id: "node-002", status: "online", tasks: 8, cpu: 32, memory: 48 },
  { id: "node-003", status: "online", tasks: 15, cpu: 68, memory: 75 },
  { id: "node-004", status: "offline", tasks: 0, cpu: 0, memory: 0 },
  { id: "node-005", status: "online", tasks: 10, cpu: 55, memory: 60 },
]

export const portServiceData = [
  { port: 80, service: "HTTP", count: 154, percentage: 22.5 },
  { port: 443, service: "HTTPS", count: 129, percentage: 18.8 },
  { port: 22, service: "SSH", count: 86, percentage: 12.6 },
  { port: 3306, service: "MySQL", count: 74, percentage: 10.8 },
  { port: 5432, service: "PostgreSQL", count: 62, percentage: 9.1 },
  { port: 8080, service: "HTTP-ALT", count: 48, percentage: 7.0 },
  { port: 21, service: "FTP", count: 31, percentage: 4.5 },
  { port: 25, service: "SMTP", count: 9, percentage: 1.3 },
  { port: 53, service: "DNS", count: 3, percentage: 0.4 },
  { port: 110, service: "POP3", count: 3, percentage: 0.4 },
]

export const componentData = [
  { name: "Apache", count: 76, vulnerabilities: 12 },
  { name: "Nginx", count: 47, vulnerabilities: 8 },
  { name: "MySQL", count: 34, vulnerabilities: 15 },
  { name: "WordPress", count: 31, vulnerabilities: 22 },
  { name: "PHP", count: 31, vulnerabilities: 18 },
  { name: "Node.js", count: 23, vulnerabilities: 7 },
]

export const pluginData = [
  { id: "PLG-001", name: "SQL注入检测", status: "active", lastRun: "2023-05-18", scanCount: 245 },
  { id: "PLG-002", name: "XSS漏洞检测", status: "active", lastRun: "2023-05-18", scanCount: 245 },
  { id: "PLG-003", name: "弱密码检测", status: "active", lastRun: "2023-05-17", scanCount: 180 },
  { id: "PLG-004", name: "目录遍历检测", status: "active", lastRun: "2023-05-16", scanCount: 210 },
  { id: "PLG-005", name: "CSRF检测", status: "inactive", lastRun: "2023-05-10", scanCount: 120 },
  { id: "PLG-006", name: "文件包含检测", status: "active", lastRun: "2023-05-15", scanCount: 195 },
]

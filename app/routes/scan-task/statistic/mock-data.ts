export const assetData = [
  { category: "Web Servers", count: 245, percentage: 32.67 },
  { category: "Databases", count: 135, percentage: 18.00 },
  { category: "API Endpoints", count: 112, percentage: 14.93 },
  { category: "Cloud Services", count: 98, percentage: 13.07 },
  { category: "IoT Devices", count: 62, percentage: 8.27 },
  { category: "Network Devices", count: 45, percentage: 6.00 },
  { category: "Mobile Apps", count: 28, percentage: 3.73 },
  { category: "Desktop Applications", count: 15, percentage: 2.00 },
  { category: "Others", count: 10, percentage: 1.33 },
]

export const vulnerabilityStats = {
  total: 10,
  unconfirmed: 3,
  fixed: 5,
  inProgress: 2,
}

export const vulnerabilityTrendData = [
  { month: "1月", critical: 5, high: 12, medium: 18, low: 25 },
  { month: "2月", critical: 8, high: 15, medium: 22, low: 30 },
  { month: "3月", critical: 12, high: 28, medium: 45, low: 55 },
  { month: "4月", critical: 42, high: 95, medium: 138, low: 180 },
  { month: "5月", critical: 25, high: 68, medium: 92, low: 120 },
  { month: "6月", critical: 10, high: 25, medium: 35, low: 50 },
  { month: "7月", critical: 8, high: 18, medium: 24, low: 40 },
  { month: "8月", critical: 6, high: 14, medium: 20, low: 35 },
  { month: "9月", critical: 7, high: 16, medium: 22, low: 38 },
  { month: "10月", critical: 9, high: 20, medium: 28, low: 45 },
  { month: "11月", critical: 11, high: 24, medium: 32, low: 50 },
  { month: "12月", critical: 14, high: 30, medium: 40, low: 60 },
]

export const nodeData = [
  { id: "node-001", status: "online", tasks: 12, cpu: 45, memory: 62 },
  { id: "node-002", status: "online", tasks: 8, cpu: 32, memory: 48 },
  { id: "node-003", status: "online", tasks: 15, cpu: 68, memory: 75 },
  { id: "node-004", status: "offline", tasks: 0, cpu: 0, memory: 0 },
  { id: "node-005", status: "online", tasks: 10, cpu: 55, memory: 60 },
  { id: "node-006", status: "online", tasks: 18, cpu: 78, memory: 85 },
  { id: "node-007", status: "online", tasks: 6, cpu: 25, memory: 40 },
  { id: "node-008", status: "maintenance", tasks: 0, cpu: 5, memory: 10 },
  { id: "node-009", status: "online", tasks: 14, cpu: 62, memory: 70 },
  { id: "node-010", status: "online", tasks: 9, cpu: 40, memory: 55 },
]

export const portServiceData = [
  { port: 80, service: "HTTP", count: 254, percentage: 22.5 },
  { port: 443, service: "HTTPS", count: 229, percentage: 20.3 },
  { port: 22, service: "SSH", count: 186, percentage: 16.5 },
  { port: 3306, service: "MySQL", count: 104, percentage: 9.2 },
  { port: 5432, service: "PostgreSQL", count: 82, percentage: 7.3 },
  { port: 8080, service: "HTTP-ALT", count: 68, percentage: 6.0 },
  { port: 21, service: "FTP", count: 51, percentage: 4.5 },
  { port: 25, service: "SMTP", count: 39, percentage: 3.5 },
  { port: 53, service: "DNS", count: 33, percentage: 2.9 },
  { port: 110, service: "POP3", count: 23, percentage: 2.0 },
  { port: 1433, service: "MSSQL", count: 18, percentage: 1.6 },
  { port: 27017, service: "MongoDB", count: 15, percentage: 1.3 },
  { port: 6379, service: "Redis", count: 12, percentage: 1.1 },
  { port: 9200, service: "Elasticsearch", count: 10, percentage: 0.9 },
  { port: 161, service: "SNMP", count: 7, percentage: 0.6 },
]

export const componentData = [
  { name: "Apache", count: 176, vulnerabilities: 32 },
  { name: "Nginx", count: 147, vulnerabilities: 28 },
  { name: "MySQL", count: 134, vulnerabilities: 45 },
  { name: "WordPress", count: 131, vulnerabilities: 62 },
  { name: "PHP", count: 131, vulnerabilities: 58 },
  { name: "Node.js", count: 123, vulnerabilities: 37 },
  { name: "Java", count: 112, vulnerabilities: 41 },
  { name: "Python", count: 98, vulnerabilities: 29 },
  { name: "Docker", count: 87, vulnerabilities: 22 },
  { name: "Kubernetes", count: 76, vulnerabilities: 18 },
  { name: "Redis", count: 65, vulnerabilities: 15 },
  { name: "MongoDB", count: 54, vulnerabilities: 20 },
  { name: "React", count: 48, vulnerabilities: 12 },
  { name: "Angular", count: 42, vulnerabilities: 14 },
  { name: "Vue.js", count: 38, vulnerabilities: 9 },
]

export const pluginData = [
  { id: "PLG-001", name: "SQL注入检测", status: "active", lastRun: "2023-05-18", scanCount: 1245 },
  { id: "PLG-002", name: "XSS漏洞检测", status: "active", lastRun: "2023-05-18", scanCount: 1245 },
  { id: "PLG-003", name: "弱密码检测", status: "active", lastRun: "2023-05-17", scanCount: 980 },
  { id: "PLG-004", name: "目录遍历检测", status: "active", lastRun: "2023-05-16", scanCount: 1110 },
  { id: "PLG-005", name: "CSRF检测", status: "inactive", lastRun: "2023-05-10", scanCount: 720 },
  { id: "PLG-006", name: "文件包含检测", status: "active", lastRun: "2023-05-15", scanCount: 895 },
  { id: "PLG-007", name: "命令注入检测", status: "active", lastRun: "2023-05-14", scanCount: 765 },
  { id: "PLG-008", name: "SSRF漏洞检测", status: "active", lastRun: "2023-05-13", scanCount: 680 },
  { id: "PLG-009", name: "XXE漏洞检测", status: "inactive", lastRun: "2023-05-09", scanCount: 540 },
  { id: "PLG-010", name: "反序列化漏洞检测", status: "active", lastRun: "2023-05-12", scanCount: 620 },
  { id: "PLG-011", name: "JWT安全检测", status: "active", lastRun: "2023-05-11", scanCount: 580 },
  { id: "PLG-012", name: "敏感信息泄露检测", status: "active", lastRun: "2023-05-10", scanCount: 1050 },
]

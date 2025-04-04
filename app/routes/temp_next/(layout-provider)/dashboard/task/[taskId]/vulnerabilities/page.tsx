"use client";

import { StatisticsCard } from "#/components/vulnerabilities/StatisticsCard";
import { VulnerabilityItem } from "#/components/vulnerabilities/VulnerabilityItem";
import { FilterBar } from "#/components/vulnerabilities/FilterBar";
import { use, useState } from "react";
import { Locale } from "#/i18n";
type MockVulnerability = {
    id: string;
    title: string;
    description: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    discoveredAt: string;
    asset: {
        identifier: string;
        location: string;
        company: string;
        tags: string[];
        url: string;
    };
};

// 模拟数据
const mockVulnerabilities: MockVulnerability[] = [
    {
        id: "vuln-001",
        title: "Apache Log4j 远程代码执行漏洞",
        description: "Apache Log4j 存在远程代码执行漏洞，攻击者可以利用该漏洞执行任意代码。",
        severity: "critical",
        discoveredAt: "2024-03-15 14:30",
        asset: {
            identifier: "192.168.1.100",
            location: "北京",
            company: "总部研发中心",
            tags: ["Apache", "Log4j", "Web服务器"],
            url: "https://example.com/app1"
        }
    },
    {
        id: "vuln-002",
        title: "SQL 注入漏洞",
        description: "在用户登录接口发现SQL注入漏洞，可能导致未经授权的数据库访问。",
        severity: "high",
        discoveredAt: "2024-03-14 09:15",
        asset: {
            identifier: "api.example.com",
            location: "上海",
            company: "电商平台",
            tags: ["MySQL", "API", "认证系统"],
            url: "https://api.example.com/login"
        }
    },
    {
        id: "vuln-003",
        title: "跨站脚本(XSS)漏洞",
        description: "在评论功能中发现存储型XSS漏洞，可能导致用户信息泄露和会话劫持。",
        severity: "medium",
        discoveredAt: "2024-03-13 16:45",
        asset: {
            identifier: "blog.example.com",
            location: "广州",
            company: "内容平台",
            tags: ["Web应用", "用户交互", "内容管理"],
            url: "https://blog.example.com/comments"
        }
    },
    {
        id: "vuln-004",
        title: "敏感信息泄露",
        description: "网站源代码中包含数据库连接凭证等敏感信息。",
        severity: "medium",
        discoveredAt: "2024-03-12 11:20",
        asset: {
            identifier: "dev.example.com",
            location: "深圳",
            company: "开发测试环境",
            tags: ["配置文件", "源代码", "测试环境"],
            url: "https://dev.example.com"
        }
    },
    {
        id: "vuln-005",
        title: "SSL/TLS 配置错误",
        description: "服务器SSL配置不当，支持不安全的加密套件。",
        severity: "low",
        discoveredAt: "2024-03-11 15:30",
        asset: {
            identifier: "mail.example.com",
            location: "成都",
            company: "邮件系统",
            tags: ["SSL", "邮件服务器", "加密配置"],
            url: "https://mail.example.com"
        }
    },
    {
        id: "vuln-006",
        title: "Redis 未授权访问",
        description: "Redis服务器配置错误，允许未经身份验证的访问。",
        severity: "high",
        discoveredAt: "2024-03-10 13:25",
        asset: {
            identifier: "192.168.1.200",
            location: "武汉",
            company: "缓存服务器",
            tags: ["Redis", "数据库", "缓存系统"],
            url: "redis://192.168.1.200:6379"
        }
    },
    {
        id: "vuln-007",
        title: "目录遍历漏洞",
        description: "Web服务器配置不当，允许访问上级目录。",
        severity: "low",
        discoveredAt: "2024-03-09 10:15",
        asset: {
            identifier: "static.example.com",
            location: "天津",
            company: "静态资源服务器",
            tags: ["Nginx", "Web服务器", "文件系统"],
            url: "https://static.example.com"
        }
    },
    {
        id: "vuln-008",
        title: "Jenkins 远程代码执行",
        description: "Jenkins控制台脚本执行功能存在未授权访问。",
        severity: "critical",
        discoveredAt: "2024-03-08 17:40",
        asset: {
            identifier: "ci.example.com",
            location: "杭州",
            company: "持续集成环境",
            tags: ["Jenkins", "CI/CD", "自动化构建"],
            url: "https://ci.example.com"
        }
    }
] as const;

const statistics = {
    total: {
        title: "漏洞总数(个)",
        mainValue: 47,
        subStats: [
            { label: "今日新增", value: 6 },
            { label: "本周新增", value: 6 }
        ]
    },
    hosts: {
        title: "受影响主机(台)",
        mainValue: 35,
        subStats: [
            { label: "内网", value: 0 },
            { label: "外网", value: 29 }
        ]
    },
    fixRate: {
        title: "修复率",
        mainValue: "55%",
        mainValueColor: "text-green-500",
        subStats: [
            { label: "待修复", value: 21 },
            { label: "已修复", value: 26 }
        ]
    },
    severity: {
        title: "严重漏洞(个)",
        mainValue: 0,
        subStats: [
            { label: "高危", value: 17 },
            { label: "中危", value: 8 },
            { label: "低危", value: 9 }
        ]
    }
};

export default function VulnerabilitiesPage({ params }: { params: Promise<{ projectId: string; lang: Locale }> }) {
    const { projectId, lang } = use(params);

    const [filters, setFilters] = useState({
        network: "all",
        status: "all",
        severity: "all",
        search: ""
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleSearch = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
    };

    return (
        <div className="space-y-6 p-6">
            {/* 统计卡片 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatisticsCard {...statistics.total} />
                <StatisticsCard {...statistics.hosts} />
                <StatisticsCard {...statistics.fixRate} />
                <StatisticsCard {...statistics.severity} />
            </div>

            {/* 筛选栏 */}
            <FilterBar onFilterChange={handleFilterChange} onSearch={handleSearch} />

            {/* 漏洞列表 */}
            <div className="space-y-4">
                {mockVulnerabilities.map((vuln) => (
                    <VulnerabilityItem projectId={projectId} lang={lang} key={vuln.id} {...vuln} />
                ))}
            </div>
        </div>
    );
}

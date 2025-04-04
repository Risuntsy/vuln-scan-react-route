import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components";

import { ArrowRight, Shield, Zap, Search } from "lucide-react";
import { ABOUT_ROUTE, LOGIN_ROUTE } from "#/routes";
import { Link } from "react-router";

export default function Index() {
  return (
    <div className="h-screen flex flex-col justify-center items-center p-8 bg-slate-50">
      <div className="max-w-5xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">ScopeSentry 漏洞扫描系统</h1>
        <p className="text-xl text-muted-foreground mb-8">全方位的网络安全扫描与漏洞检测解决方案</p>
        <div className="flex justify-center gap-4">
          <Link to={LOGIN_ROUTE}>
            <Button size="lg">
              立即登录
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to={ABOUT_ROUTE}>
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>全面的漏洞检测</CardTitle>
            <CardDescription>支持多种漏洞类型检测，包括SQL注入、XSS、信息泄露等</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              采用先进的扫描引擎，精准识别各类安全威胁，为您的系统提供全面保护
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>高效的扫描性能</CardTitle>
            <CardDescription>分布式架构设计，支持大规模并发扫描任务</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">优化的扫描算法，快速完成资产探测与漏洞分析，节省宝贵时间</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Search className="h-8 w-8 text-primary mb-2" />
            <CardTitle>智能资产管理</CardTitle>
            <CardDescription>自动发现与分类网络资产，构建完整资产图谱</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">持续监控资产变化，及时发现新增资产与潜在风险，保障网络安全</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

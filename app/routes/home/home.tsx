import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components";
import { ArrowRight, Network, Code, Bug } from "lucide-react";
import { ABOUT_ROUTE, LOGIN_ROUTE } from "#/routes";
import { Link } from "react-router";
import { APP_NAME } from "#/configs/constant";


export default function Index() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 bg-slate-50">
      <div className="max-w-5xl w-full text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{APP_NAME} 分布式安全扫描系统</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">基于分布式架构的资产测绘与漏洞检测平台</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to={LOGIN_ROUTE}>
            <Button size="lg" className="w-full sm:w-auto">
              立即登录
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to={ABOUT_ROUTE}>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              了解更多
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl">
        <Card>
          <CardHeader>
            <Network className="h-8 w-8 text-primary mb-2" />
            <CardTitle>分布式资产测绘</CardTitle>
            <CardDescription>支持多节点部署，灵活配置扫描任务</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              通过构建多个节点，自由选择节点运行扫描任务，实现高效的资产发现与管理
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Code className="h-8 w-8 text-primary mb-2" />
            <CardTitle>插件化架构</CardTitle>
            <CardDescription>支持自定义插件，灵活扩展扫描能力</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">通过插件系统集成各类安全工具，支持自定义WEB指纹和POC导入</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Bug className="h-8 w-8 text-primary mb-2" />
            <CardTitle>全面的安全检测</CardTitle>
            <CardDescription>支持子域名枚举、漏洞扫描、敏感信息检测等</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">提供完整的资产安全评估，包括端口扫描、目录扫描、页面监控等功能</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { Button } from "#/components";
import { HOME_ROUTE, LOGIN_ROUTE } from "#/routes";
import { APP_NAME } from "#/configs/constant";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">关于 {APP_NAME}</h1>
        <div className="space-x-4">
          <Link to={HOME_ROUTE}>
            <Button variant="outline">返回首页</Button>
          </Link>
          <Link to={LOGIN_ROUTE}>
            <Button variant="default">登录</Button>
          </Link>
        </div>
      </div>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">系统简介</h2>
        <p className="text-gray-700 mb-4">
          {APP_NAME} 是一个现代化的漏洞扫描系统，专注于帮助企业和组织发现、评估和管理其IT资产中的安全漏洞。
          我们的系统采用先进的扫描技术，提供全面的资产发现、漏洞检测和风险评估功能。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">主要功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-medium mb-2">资产发现</h3>
            <p className="text-gray-600">自动发现和管理网络资产，包括子域名枚举、端口扫描等</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-medium mb-2">漏洞扫描</h3>
            <p className="text-gray-600">支持多种漏洞检测方式，包括主动扫描和被动扫描</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-medium mb-2">风险评估</h3>
            <p className="text-gray-600">提供详细的风险评估报告和修复建议</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-medium mb-2">自动化运维</h3>
            <p className="text-gray-600">支持定时任务和自动化工作流程</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">技术特点</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>分布式架构设计，支持多节点部署</li>
          <li>插件化系统，易于扩展和自定义</li>
          <li>完善的 API 接口，支持与其他系统集成</li>
          <li>实时监控和告警机制</li>
          <li>丰富的数据可视化和统计分析功能</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
        <p className="text-gray-700">
          如果您有任何问题或建议，请通过以下方式联系我们：
        </p>
        <div className="mt-4">
        
        </div>
      </section>
    </div>
  );
}

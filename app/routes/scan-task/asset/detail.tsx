import { getAssetDetail } from "#/api";
import { getToken } from "#/lib/cookie";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { redirect } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, Header, Button } from "#/components";
import { Badge } from "#/components";
import { ScrollArea } from "#/components";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { DASHBOARD_ROUTE } from "#/routes";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const { assetId } = params;
  if (!assetId) {
    return redirect("/404");
  }
  const asset = await getAssetDetail({ id: assetId, token });

  if (!asset.json) {
    return redirect("/404");
  }

  console.log(asset);

  return { asset: asset.json };
}

export default function ScanTaskAssetDetailPage() {
  const navigate = useNavigate();
  const { asset } = useLoaderData<typeof loader>();

  return (
    <>
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "资产详情" }]}>
        <div className="flex flex-col md:flex-row w-full gap-2 justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold">{asset.title || asset.host || asset.ip}</h1>
              <Badge variant="outline" className="font-normal">
                {asset.service}
              </Badge>
            </div>
          </div>
        </div>
      </Header>

      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{asset.title || asset.host || asset.ip}</h2>
                <Badge variant={asset.statuscode < 400 ? "default" : "destructive"}>{asset.statuscode}</Badge>
              </div>
              {asset.url && (
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  访问
                </a>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">基本信息</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">IP:</span>
                    <span className="ml-2">{asset.ip}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">端口:</span>
                    <span className="ml-2">{asset.port}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">服务类型:</span>
                    <span className="ml-2">{asset.service}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">发现时间:</span>
                    <span className="ml-2">{asset.time}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">最后扫描:</span>
                    <span className="ml-2">{asset.lastScanTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">技术栈</h3>
                <div className="flex flex-wrap gap-2">
                  {asset.technologies?.map((tech: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">HTTP响应头</h3>
              <ScrollArea className="h-[200px]">
                <pre className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap">{asset.rawheaders}</pre>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">响应内容</h3>
              <ScrollArea className="h-[400px]">
                <pre className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap">{asset.body}</pre>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

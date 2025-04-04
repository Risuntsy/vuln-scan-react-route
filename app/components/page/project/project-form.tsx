import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
  Button,
  Label,
  Input,
  Alert,
  AlertDescription,
  Textarea
} from "../../../vuln-scan-next/components/ui";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectModel } from "#/model";

import {
  FormField,
  FormGrid,
  FormSection,
  WarningAlert,
  ImagePreview,
  SwitchOption,
  Divider,
  FormLabel
} from "../../.client/components/form";

interface ProjectFormProps {
  onSubmit: (projectData: ProjectModel) => Promise<void>;
  initialData?: Partial<ProjectModel>;
  isEditing?: boolean;
}

export default function ProjectForm({ onSubmit, initialData, isEditing }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state from initialData or with defaults
  const [domain, setDomain] = useState(initialData?.domain || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || ["周期任务"]);
  const [cluster, setCluster] = useState(initialData?.cluster || "集群");
  const [historyData, setHistoryData] = useState(initialData?.historyData || 180);
  const [targets, setTargets] = useState(initialData?.targets || "");

  const [portType, setPortType] = useState(initialData?.portType || "all");
  const [ports, setPorts] = useState(initialData?.ports || []);
  const [notifications, setNotifications] = useState(
    initialData?.notifications !== undefined ? initialData.notifications : true
  );
  const [associateSubdomains, setAssociateSubdomains] = useState(
    initialData?.associateSubdomains !== undefined ? initialData.associateSubdomains : true
  );
  const [associateIPs, setAssociateIPs] = useState(
    initialData?.associateIPs !== undefined ? initialData.associateIPs : true
  );
  const [associateCertIPs, setAssociateCertIPs] = useState(
    initialData?.associateCertIPs !== undefined ? initialData.associateCertIPs : true
  );
  const [isPublic, setIsPublic] = useState(initialData?.isPublic !== undefined ? initialData.isPublic : false);
  const [enableScanning, setEnableScanning] = useState(
    initialData?.enableScanning !== undefined ? initialData.enableScanning : true
  );
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Construct project data from form state
      const projectData: ProjectModel = {
        domain,
        tags,
        cluster,
        historyData,
        targets,
        portType,
        ports: portType === "custom" ? ports : [],
        notifications,
        associateSubdomains,
        associateIPs,
        associateCertIPs,
        isPublic,
        enableScanning,
        logoUrl,
        description
      };

      // If editing, include the ID
      if (isEditing && initialData?.id) {
        projectData.id = initialData.id;
      }

      await onSubmit(projectData);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormGrid>
        <FormField label="项目名称" required>
          <Input id="domain" value={domain} onChange={e => setDomain(e.target.value)} placeholder="资产探测" required />
        </FormField>

        <FormField label="标签">
          <Select value={tags[0]} onValueChange={value => setTags([value])}>
            <SelectTrigger>
              <SelectValue placeholder="通过标签更好的管理项目" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="周期任务">周期任务</SelectItem>
              <SelectItem value="重要资产">重要资产</SelectItem>
              <SelectItem value="临时任务">临时任务</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="扫描集群" required>
          <Select value={cluster} onValueChange={setCluster}>
            <SelectTrigger>
              <SelectValue placeholder="请选择扫描集群" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="集群">集群</SelectItem>
              <SelectItem value="集群1">集群1</SelectItem>
              <SelectItem value="集群2">集群2</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="历史数据">
          <Input
            id="historyData"
            type="number"
            value={historyData}
            onChange={e => setHistoryData(parseInt(e.target.value))}
            min={0}
            max={730}
          />
        </FormField>
      </FormGrid>

      <FormSection>
        <FormLabel label="探测目标" required />
        <WarningAlert icon="alert">根域名数量建议不超过50，IP数量不超过30000</WarningAlert>
        <div className="mt-2">
          <Textarea
            placeholder={`目标列表，换行添加，支持如下格式
192.0.2.18-192.0.2.128
192.0.2.18/24
192.0.2.18
"*.example.com"  example.com 根域名
"admin.*.example.com"  admin.*.example.com 的子域名
"*-api.example.com"  -api.example.com 的子域名
系统会将*替换为字典进行爆破，为提高扫描效率，请检查*位置
abc.example.com 导入子域名`}
            id="targets"
            value={targets}
            onChange={e => setTargets(e.target.value)}
            rows={6}
            className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </FormSection>

      <FormSection>
        <FormLabel label="探测端口" required />
        <WarningAlert icon="info">IP数量过多时建议选择特定端口</WarningAlert>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <Select value={portType} onValueChange={value => setPortType(value as "all" | "common" | "web" | "custom")}>
            <SelectTrigger>
              <SelectValue placeholder="策略模板" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全端口</SelectItem>
              <SelectItem value="common">常用端口</SelectItem>
              <SelectItem value="web">Web端口</SelectItem>
              <SelectItem value="custom">指定端口</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {portType === "custom" && (
          <Textarea
            id="ports"
            value={ports.join(",")}
            onChange={e => setPorts(e.target.value.split(","))}
            placeholder="支持 21-22,80 格式"
            rows={3}
            className="min-h-[80px]"
          />
        )}
      </FormSection>

      <FormSection>
        <Label htmlFor="certificates" className="font-medium">
          关联主体或证书
        </Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cert1">证书1</SelectItem>
            <SelectItem value="cert2">证书2</SelectItem>
          </SelectContent>
        </Select>
      </FormSection>

      <FormGrid className="mt-4">
        <FormField label="开启通知" className="space-y-2">
          <SwitchOption id="notifications" checked={notifications} onChange={setNotifications} label="开启动态通知" />
        </FormField>

        <div className="space-y-2">
          <Label className="font-medium block mb-2">关联模式</Label>
          <div className="flex flex-col space-y-2">
            <SwitchOption
              id="associateSubdomains"
              checked={associateSubdomains}
              onChange={setAssociateSubdomains}
              label="关联子域名"
            />
            <SwitchOption id="associateIPs" checked={associateIPs} onChange={setAssociateIPs} label="关联解析IP" />
            <SwitchOption
              id="associateCertIPs"
              checked={associateCertIPs}
              onChange={setAssociateCertIPs}
              label="关联证书IP"
            />
          </div>
        </div>

        <FormField label="团队内公开" className="space-y-2">
          <SwitchOption
            id="isPublic"
            checked={isPublic}
            onChange={setIsPublic}
            label={isPublic ? "团队可见" : "仅自己可见"}
          />
        </FormField>
      </FormGrid>

      <Divider />

      <FormSection>
        <Label htmlFor="enableScanning" className="font-medium block mb-2">
          开启探测
        </Label>
        <SwitchOption id="enableScanning" checked={enableScanning} onChange={setEnableScanning} label="开启资产探测" />
      </FormSection>

      <FormSection>
        <Label className="font-medium block mb-2">探测时间</Label>
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
          {/* <DateRangePicker /> */}
          <div className="flex items-center gap-2">
            <Select defaultValue="0">
              <SelectTrigger>
                <SelectValue placeholder="请选择扫描时间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 点</SelectItem>
                <SelectItem value="1">1 点</SelectItem>
                <SelectItem value="2">2 点</SelectItem>
                <SelectItem value="3">3 点</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" min={0} max={366} step={0.1} defaultValue={0} className="w-[100px]" />
          </div>
        </div>
      </FormSection>

      <FormGrid className="mt-4">
        <FormField label="网站图标关联">
          <p className="text-sm text-muted-foreground">点击图标删除</p>
          <ImagePreview url={logoUrl} placeholder="暂无图标" />
        </FormField>

        <FormField label="项目Logo">
          <Input placeholder="输入Logo URL" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
          <ImagePreview url={logoUrl} placeholder="预览区域" />
        </FormField>
      </FormGrid>

      <FormSection>
        <Label htmlFor="description" className="font-medium">
          项目描述
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="项目描述信息"
          rows={3}
        />
      </FormSection>

      <div className="flex justify-end space-x-4 pt-6 sticky bottom-0 bg-background pb-4">
        <Button variant="outline" onClick={() => router.back()} type="button" disabled={isSubmitting}>
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "提交中..." : isEditing ? "更新项目" : "保存项目"}
        </Button>
      </div>
    </form>
  );
}

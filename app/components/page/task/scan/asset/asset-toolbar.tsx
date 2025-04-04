import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";

export function AssetToolbar() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input placeholder="输入筛选条件 (例如: domain=example.com, port=80)" className="w-full" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline">筛选</Button>
        <Button variant="outline">重置</Button>
      </div>
    </div>
  );
}

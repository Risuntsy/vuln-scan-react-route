import { type StatisticsItem } from "#/api";
import { GenericStatisticsList, type GenericStatisticsListProps } from "./generic-statistics-list";

const COMMON_PORTS: Record<string, string> = {
  "21": "FTP",
  "22": "SSH",
  "23": "Telnet",
  "25": "SMTP",
  "53": "DNS",
  "80": "HTTP",
  "110": "POP3",
  "143": "IMAP",
  "443": "HTTPS",
  "1433": "MSSQL",
  "3306": "MySQL",
  "3389": "RDP",
  "6379": "Redis",
  "8080": "HTTP代理",
  "27017": "MongoDB"
} as const;

type PortServiceListProps = Omit<GenericStatisticsListProps, "title" | "tagType">;

export function PortServiceList(props: PortServiceListProps) {
  const renderPortItem = (item: StatisticsItem) => (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <span className="text-sm">{item.value}</span>
        {COMMON_PORTS[item.value as string] && (
          <span className="text-muted-foreground text-xs">({COMMON_PORTS[item.value as string]})</span>
        )}
      </span>
      <span className="flex-shrink-0">
        <span className="bg-secondary text-secondary-foreground rounded-md text-xs px-2 py-0.5">
          {item.number.toLocaleString()}
        </span>
      </span>
    </div>
  );

  return <GenericStatisticsList {...props} title="端口服务" tagType="port" renderItem={renderPortItem} />;
}

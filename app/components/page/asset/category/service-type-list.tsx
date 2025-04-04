import { GenericStatisticsList, type GenericStatisticsListProps } from "./generic-statistics-list";

type ServiceTypeListProps = Omit<GenericStatisticsListProps, "title" | "tagType">;

export function ServiceTypeList(props: ServiceTypeListProps) {
  return (
    <GenericStatisticsList
      {...props}
      title="服务类型"
      tagType="service"
    />
  );
}

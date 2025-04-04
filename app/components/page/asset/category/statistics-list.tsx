import { GenericStatisticsList, type GenericStatisticsListProps } from "./generic-statistics-list";

type StatisticsListProps = Omit<GenericStatisticsListProps, "title" | "tagType">;

export function StatisticsList(props: StatisticsListProps) {
  return (
    <GenericStatisticsList
      {...props}
      title="应用服务"
      tagType="product"
    />
  );
}

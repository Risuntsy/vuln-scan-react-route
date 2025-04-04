const tabConfig = [
  { tab: "list", title: "资产列表" },
  { tab: "statistics", title: "统计数据" }
] as const;

export function AssetFilterBar() {
  // TODO: 需要重构
  return null;
  // const { lang, taskId } = useParams<{ lang: Locale; taskId: string }>();
  // const { activeTab, search, page } = useAssetSearchParams();

  // const [newSearch, setNewSearch] = useState("");
  // const r = useLanguageRoute(lang);

  // const getHref = (tab: typeof activeTab, search: string) =>
  //   r(SCAN_TASK_ASSETS_ROUTE, { query: { tab, search, page }, params: { taskId } });

  // return (
  //   <div className="space-y-4">
  //     <div className="flex flex-col md:flex-row gap-4">
  //       <Input
  //         className="flex-1"
  //         value={newSearch}
  //         onChange={e => setNewSearch(e.target.value)}
  //         placeholder={`输入筛选条件 (例如: domain="example.com", port=80)`}
  //       />
  //       <div className="flex gap-2">
  //         <Link href={getHref(activeTab, newSearch)}>
  //           <Button variant="default">筛选</Button>
  //         </Link>
  //         <Link href={getHref(activeTab, "")}>
  //           <Button variant="outline">重置</Button>
  //         </Link>
  //       </div>
  //     </div>

  //     <div className="flex gap-2">
  //       {tabConfig.map(({ tab, title }) => (
  //         <Link key={tab} href={getHref(tab, search)}>
  //           <Button variant={tab === activeTab ? "default" : "outline"}>{title}</Button>
  //         </Link>
  //       ))}
  //     </div>
  //   </div>
  // );
}

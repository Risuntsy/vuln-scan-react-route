// "use server";

// import { getAssetStatisticsPort, getAssetStatisticsType, getAssetStatisticsIcon, getAssetStatisticsApp } from "./api";
// import { FilterRequest } from "./entity";

// // 使用已有的类型，只添加必要的新类型
// interface AssetOverviewStats {
//     portStats: {
//         category: string;
//         items: Array<{
//             name: string;
//             count: number;
//         }>;
//     }[];
//     typeStats: {
//         category: string;
//         items: Array<{
//             name: string;
//             count: number;
//         }>;
//     }[];
//     iconStats: Array<{
//         hash: string;
//         icon: string;
//         count: number;
//     }>;
//     appStats: {
//         title: string;
//         description: string;
//         items: Array<{
//             name: string;
//             count: number;
//         }>;
//     }[];
// }

// export async function getAssetOverviewStats(data: { taskId: string }): Promise<AssetOverviewStats> {
//     // 并行请求所有统计数据
//     const requestData: FilterRequest = {
//         search: "",
//         pageIndex: 1,
//         pageSize: 20,
//         filter: data
//     };

//     const

//     const [portStats, typeStats, iconStats, appStats] = await Promise.all([
//         getAssetStatisticsPort(requestData),
//         getAssetStatisticsType(requestData),
//         getAssetStatisticsIcon(requestData),
//         getAssetStatisticsApp(requestData)
//     ]);

//     // 处理端口统计数据
//     const portCategories = new Map<string, Array<{ name: string; count: number }>>();
//     portStats.Port.forEach(item => {
//         const category = "端口服务";
//         if (!portCategories.has(category)) {
//             portCategories.set(category, []);
//         }
//         portCategories.get(category)?.push({
//             name: `${item.value}`,
//             count: item.number
//         });
//     });

//     // 处理类型统计数据
//     const typeCategories = new Map<string, Array<{ name: string; count: number }>>();
//     typeStats.Service.forEach(item => {
//         const category = "服务类型";
//         if (!typeCategories.has(category)) {
//             typeCategories.set(category, []);
//         }
//         typeCategories.get(category)?.push({
//             name: item.value as string,
//             count: item.number
//         });
//     });

//     return {
//         portStats: Array.from(portCategories.entries()).map(([category, items]) => ({
//             category,
//             items: items.sort((a, b) => b.count - a.count).slice(0, 20)
//         })),
//         typeStats: Array.from(typeCategories.entries()).map(([category, items]) => ({
//             category,
//             items: items.sort((a, b) => b.count - a.count).slice(0, 20)
//         })),
//         iconStats: iconStats.Icon.map(item => ({
//             icon: `data:image/png;base64,${item.value}`,
//             hash: item.icon_hash,
//             count: item.number
//         })).sort((a, b) => b.count - a.count).slice(0, 20),
//         appStats: [
//             {
//                 title: "应用服务",
//                 description: "应用服务统计",
//                 items: appStats.Product.map(item => ({
//                     name: item.value as string,
//                     count: item.number
//                 }))
//                     .sort((a, b) => b.count - a.count)
//                     .slice(0, 20)
//             }
//         ]
//     };
// }

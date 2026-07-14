import ItemCard from "@/components/ItemCard";

/* 示例混合数据 —— 后续替换为 API 接口数据 */
const mixedItems = [
  { id: 1, title: "二手 iPad Air 4",       price: 1800, type: "market" as const, date: "2小时前",  description: "95新，配件齐全，可面交" },
  { id: 2, title: "寻找丢失的校园卡",       type: "lost"  as const, date: "今天",    location: "图书馆",  status: "寻找中" },
  { id: 3, title: "高等数学教材（第七版）",  price: 25,   type: "market" as const, date: "3小时前",  description: "有少量笔记标注" },
  { id: 4, title: "拾到一副 AirPods",       type: "found" as const, date: "昨天",    location: "食堂二楼",  status: "等待认领" },
  { id: 5, title: "小米台灯",              price: 35,   type: "market" as const, date: "昨天",    description: "毕业带不走，便宜出" },
  { id: 6, title: "丢失一串钥匙",          type: "lost"  as const, date: "2天前",   location: "操场附近",  status: "寻找中" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* 顶部标题栏 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Fiund</h1>
        <p className="text-xs text-gray-400">校园物品流转平台</p>
      </header>

      {/* 混合卡片流 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {mixedItems.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

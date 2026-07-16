import { useState, useEffect } from "react";

export interface Item {
  id: number;
  title: string;
  description: string;
  price?: number;
  image?: string;
  type: "market" | "lost" | "found";
  status?: string;
  date: string;
  location?: string;
  category?: string;
  contact?: string;
  detail: string;
}

/* ══════════════════════════════════════════════════════════
   动态物品 —— localStorage 持久化 + 订阅通知
   ══════════════════════════════════════════════════════════ */
let dynamicItems: Item[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

/** 添加新物品（自动持久化到 localStorage 并通知订阅者） */
export function addDynamicItem(item: Omit<Item, "id" | "date">): Item {
  const newItem: Item = {
    ...item,
    id: Date.now(),
    date: "刚刚",
  };
  dynamicItems = [newItem, ...dynamicItems];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("fiund_items", JSON.stringify(dynamicItems));
    } catch {}
  }
  notify();
  return newItem;
}

function loadDynamicItems(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("fiund_items");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 初始化时从 localStorage 加载，确保 getItemById 在刷新后也能找到用户发布的物品
if (typeof window !== "undefined") {
  dynamicItems = loadDynamicItems();
}

/** React Hook —— 获取全部物品（静态 + 动态），自动响应新增 */
export function useItems(): Item[] {
  const [dynamic, setDynamic] = useState<Item[]>([]);

  useEffect(() => {
    setDynamic(loadDynamicItems());
    const sub = () => setDynamic([...dynamicItems]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, []);

  return [...staticItems, ...dynamic].sort((a, b) => b.id - a.id);
}

/** 根据 id 查找物品 */
export function getItemById(id: number): Item | undefined {
  return [...staticItems, ...dynamicItems].find((item) => item.id === id);
}

/** 按类型筛选 */
export function getItemsByType(
  type: "market" | "lost" | "found",
  items?: Item[]
): Item[] {
  const source = items ?? [...staticItems, ...dynamicItems].sort((a, b) => b.id - a.id);
  return source.filter((item) => item.type === type);
}

/** 获取混合列表（首页用） */
export function getMixedItems(items?: Item[]): Item[] {
  const source = items ?? [...staticItems, ...dynamicItems].sort((a, b) => b.id - a.id);
  return source.slice(0, 8);
}

/* ══════════════════════════════════════════════════════════
   静态示例数据 —— 后续替换为 API 调用
   ══════════════════════════════════════════════════════════ */
const staticItems: Item[] = [
  /* ---- 二手交易 ---- */
  {
    id: 8,
    title: "二手 iPad Air 4",
    description: "95新，配件齐全，可面交",
    price: 1800,
    image: "/images/items/1-ipad.jpg",
    type: "market",
    date: "2小时前",
    category: "数码",
    contact: "微信: ipad_seller_2026",
    detail:
      "iPad Air 4 64GB 天蓝色，2024年9月购入，使用不到一年。屏幕无划痕，电池健康度96%。原装充电器、数据线齐全，附送一个保护壳。因为换了新款所以出售，校内可面交验货。",
  },
  {
    id: 7,
    title: "高等数学教材（第七版）",
    description: "有少量笔记标注",
    price: 25,
    image: "/images/items/2-math-book.jpg",
    type: "market",
    date: "3小时前",
    category: "教材",
    contact: "QQ: 123456789",
    detail:
      "同济大学出版社《高等数学》第七版上下册合售。书内有少量铅笔标注和课堂笔记，不影响阅读。适合大一同学或考研复习使用。",
  },
  {
    id: 6,
    title: "小米台灯",
    description: "毕业带不走，便宜出",
    price: 35,
    image: "/images/items/3-desk-lamp.jpg",
    type: "market",
    date: "昨天",
    category: "生活",
    contact: "电话: 138xxxx1234",
    detail:
      "小米米家台灯Pro，三档色温调节，支持手机APP控制。用了两年，功能完全正常，灯管无频闪。毕业搬家带不走，低价出给需要的同学。",
  },
  {
    id: 5,
    title: "Nike Air Max 运动鞋",
    description: "42码，八成新",
    price: 120,
    image: "/images/items/4-nike-shoes.jpg",
    type: "market",
    date: "2天前",
    category: "服饰",
    contact: "微信: nike_fan",
    detail:
      "Nike Air Max 270 黑白配色，42码。穿了大约两个月，鞋底磨损很轻，鞋面干净无破损。买大了半码所以转让，适合41.5-42码的同学。",
  },
  {
    id: 4,
    title: "罗技 G304 鼠标",
    description: "无线游戏鼠标，手感极佳",
    price: 89,
    image: "/images/items/5-logitech-mouse.jpg",
    type: "market",
    date: "3天前",
    category: "数码",
    contact: "微信: gamer_zhang",
    detail:
      "罗技 G304 无线游戏鼠标，LIGHTSPEED 技术延迟极低。使用一节5号电池续航可达250小时。微动正常无双击，脚贴已更换新。附送一个鼠标垫。",
  },
  {
    id: 3,
    title: "考研英语真题集",
    description: "2015-2025 十年真题",
    price: 15,
    image: "/images/items/6-exam-book.jpg",
    type: "market",
    date: "4天前",
    category: "教材",
    contact: "QQ: 987654321",
    detail:
      "张剑黄皮书《考研英语一历年真题》2015-2025版。已做完，部分题目有铅笔标注答案（可擦除）。适合25考研同学，低价转让。",
  },
  {
    id: 2,
    title: "宿舍小风扇",
    description: "USB 充电，三挡调速",
    price: 20,
    image: "/images/items/7-fan.jpg",
    type: "market",
    date: "5天前",
    category: "生活",
    contact: "电话: 139xxxx5678",
    detail:
      "USB 充电式桌面小风扇，三挡风速可调，充满电可用8小时。夹在床头或放在桌上都行，夏天宿舍必备。毕业出清，功能完好。",
  },
  {
    id: 1,
    title: "优衣库黑色外套",
    description: "L码，几乎没穿过",
    price: 60,
    image: "/images/items/8-jacket.jpg",
    type: "market",
    date: "一周前",
    category: "服饰",
    contact: "微信: uni_fashion",
    detail:
      "优衣库2025年秋季款防风夹克，黑色L码。买回来后只穿过一次发现不太合身，吊牌已剪但几乎全新。适合170-178cm身高。",
  },

  /* ---- 失物招领 ---- */
  {
    id: 106,
    title: "寻找丢失的校园卡",
    description: "蓝色卡套，内有校园一卡通",
    image: "/images/items/101-campus-card.jpg",
    type: "lost",
    status: "寻找中",
    date: "今天",
    location: "图书馆",
    contact: "电话: 137xxxx9012",
    detail:
      "今天下午2点左右在图书馆三楼自习室遗忘了一张校园卡，蓝色硅胶卡套，卡号尾号3456。卡里还有约200元余额。如有拾到请联系我，非常感谢！",
  },
  {
    id: 105,
    title: "拾到一副 AirPods",
    description: "白色 AirPods Pro，在食堂二楼座位上发现",
    image: "/images/items/102-airpods.jpg",
    type: "found",
    status: "等待认领",
    date: "昨天",
    location: "食堂二楼",
    contact: "交到食堂一楼前台",
    detail:
      "昨天中午12点左右在食堂二楼靠窗座位拾到一副白色 AirPods Pro（第二代），充电盒有轻微磨损。已交给食堂一楼前台保管，请失主凭 AirPods 序列号或蓝牙配对记录前来认领。",
  },
  {
    id: 104,
    title: "丢失一串钥匙",
    description: "三把钥匙加一个小熊挂件",
    image: "/images/items/103-keys.jpg",
    type: "lost",
    status: "寻找中",
    date: "2天前",
    location: "操场附近",
    contact: "微信: key_lost",
    detail:
      "前天傍晚在操场跑步时可能掉落了一串钥匙，共三把（两把银色一把铜色），挂着一个棕色小熊挂件。可能在跑道或看台附近，如有拾到请联系，请帮忙扩散！",
  },
  {
    id: 103,
    title: "拾到一本《线性代数》",
    description: "同济第六版，内有课堂笔记",
    image: "/images/items/104-linalg-book.jpg",
    type: "found",
    status: "已认领",
    date: "3天前",
    location: "教学楼A",
    contact: "已归还失主",
    detail:
      "在教学楼A302教室靠窗第三排拾到一本同济大学《线性代数》第六版，书内有大量手写笔记和课堂标注。已通过书内夹的纸条联系到失主并归还。",
  },
  {
    id: 102,
    title: "丢失黑色双肩包",
    description: "内含笔记本电脑和教材",
    image: "/images/items/105-backpack.jpg",
    type: "lost",
    status: "寻找中",
    date: "4天前",
    location: "校车站",
    contact: "电话: 136xxxx3456",
    detail:
      "上周五下午在校车站等车时，将一个黑色双肩包遗忘在候车椅上。包内有联想ThinkPad笔记本一台、《数据结构》教材一本、充电宝一个。包是小米品牌，拉链处挂了一个红色中国结。非常着急，请拾到者联系我，必有感谢！",
  },
  {
    id: 101,
    title: "拾到一把雨伞",
    description: "深蓝色折叠伞，天堂牌",
    image: "/images/items/106-umbrella.jpg",
    type: "found",
    status: "等待认领",
    date: "5天前",
    location: "实验楼",
    contact: "实验楼一楼值班室",
    detail:
      "上周三下午在实验楼一楼大厅的伞架上拾到一把深蓝色天堂折叠伞，伞柄处有磨损。已放在实验楼一楼值班室，请失主到值班室报伞的特征即可领取。",
  },
];

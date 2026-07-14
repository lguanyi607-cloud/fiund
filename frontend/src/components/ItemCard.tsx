interface ItemCardProps {
  title: string;
  description?: string;
  price?: number;
  image?: string;
  type?: "market" | "lost" | "found";
  status?: string;
  date?: string;
  location?: string;
}

export default function ItemCard({
  title,
  description,
  price,
  image,
  type = "market",
  status,
  date,
  location,
}: ItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* 图片区域 */}
      <div className="aspect-square bg-gray-100 relative">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            {type === "market" ? "🛍️" : type === "lost" ? "🔍" : "📦"}
          </div>
        )}
        {/* 类型标签 */}
        {type !== "market" && (
          <span
            className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full text-white ${
              type === "lost" ? "bg-orange-500" : "bg-green-500"
            }`}
          >
            {type === "lost" ? "寻物" : "拾到"}
          </span>
        )}
        {/* 状态标签 */}
        {status && (
          <span
            className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full text-white ${
              status === "已认领" ? "bg-green-500" : "bg-orange-400"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-800 truncate">{title}</h3>

        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
        )}

        {/* 二手商品价格 */}
        {price !== undefined && (
          <p className="text-blue-600 font-bold mt-1.5">¥{price}</p>
        )}

        {/* 底部信息 */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          {date && <span>{date}</span>}
          {location && (
            <>
              <span>·</span>
              <span>{location}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

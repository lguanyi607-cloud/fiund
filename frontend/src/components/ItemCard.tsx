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
    <div className="bg-white rounded-2xl overflow-hidden border border-orange-100/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
      {/* 图片区域 */}
      <div className="aspect-square bg-gradient-to-br from-orange-50 to-amber-50 relative">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {type === "market" ? "🛍️" : type === "lost" ? "🔍" : "📦"}
          </div>
        )}
        {/* 类型标签 */}
        {type !== "market" && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white shadow-sm ${
              type === "lost"
                ? "bg-gradient-to-r from-orange-500 to-orange-400"
                : "bg-gradient-to-r from-emerald-500 to-emerald-400"
            }`}
          >
            {type === "lost" ? "寻物" : "拾到"}
          </span>
        )}
        {/* 状态标签 */}
        {status && (
          <span
            className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full text-white shadow-sm ${
              status === "已认领"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                : "bg-gradient-to-r from-orange-400 to-amber-400"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 truncate leading-snug">{title}</h3>

        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{description}</p>
        )}

        {/* 二手商品价格 */}
        {price !== undefined && (
          <p className="text-gradient font-bold text-base mt-1.5">¥{price}</p>
        )}

        {/* 底部信息 */}
        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
          {date && <span>{date}</span>}
          {location && (
            <>
              <span className="text-orange-300">·</span>
              <span>{location}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

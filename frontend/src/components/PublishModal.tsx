"use client";

import { useState, useRef, useEffect } from "react";
import { addDynamicItem } from "@/data/items";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  type: "market" | "lost" | "found";
}

const marketCategories = ["教材", "数码", "生活", "服饰"];

export default function PublishModal({ open, onClose, type }: PublishModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [detail, setDetail] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMarket = type === "market";
  const headerTitle = isMarket ? "发布二手商品" : type === "lost" ? "发布寻物启事" : "发布拾到通知";

  function reset() {
    setTitle(""); setDescription(""); setPrice(""); setCategory("");
    setLocation(""); setContact(""); setDetail("");
    setImagePreview(null); setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // 弹窗打开时重置表单
  useEffect(() => {
    if (open) {
      reset();
      setShowSuccess(false);
    }
  }, [open]);

  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小建议不超过 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageData(result);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function removeImage() {
    setImagePreview(null);
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit() {
    if (!title.trim() || !detail.trim()) return;

    addDynamicItem({
      title: title.trim(),
      description: description.trim() || title.trim(),
      type,
      price: isMarket && price ? Number(price) : undefined,
      category: isMarket ? category : undefined,
      location: !isMarket ? location : undefined,
      contact: contact.trim() || undefined,
      detail: detail.trim(),
      image: imageData || undefined,
      status: isMarket ? undefined : type === "lost" ? "寻找中" : "等待认领",
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      reset();
      onClose();
    }, 1200);
  }

  /* ---- 共用样式 ---- */
  const label = "block text-xs text-gray-500 mb-1.5 font-medium";
  const input = "w-full px-3.5 py-2.5 bg-orange-50/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200 border border-orange-100 transition-all duration-200 placeholder:text-gray-400";

  return (
    <>
      {/* 遮罩层 */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center animate-scale-in"
            style={{ backdropFilter: "blur(10px)" }}>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-3 shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-800">发布成功</p>
          </div>
        </div>
      )}

      {/* 表单抽屉 */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[28px] z-50 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* 拖拽指示条 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-orange-200 rounded-full" />
        </div>

        {/* 标题栏 */}
        <div className="px-5 py-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">{headerTitle}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 表单内容 */}
        <div className="px-5 pb-8 space-y-4">

          {/* 图片上传 */}
          <div>
            <label className={label}>图片</label>
            {imagePreview ? (
              <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-orange-100">
                <img src={imagePreview} alt="预览" className="w-full h-full object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-orange-400 bg-orange-50"
                    : "border-orange-200 bg-orange-50/30 hover:border-orange-300 hover:bg-orange-50/60"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">点击或拖拽上传图片</p>
                <p className="text-[10px] text-gray-400 mt-1">支持 JPG、PNG，建议不超过 2MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 标题 */}
          <div>
            <label className={label}>标题 *</label>
            <input className={input} value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder={isMarket ? "例：二手 iPad Air 4" : "例：丢失一串钥匙"} />
          </div>

          {/* 简述 */}
          <div>
            <label className={label}>简述</label>
            <input className={input} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="一句话描述（显示在卡片上）" />
          </div>

          {/* 二手专属：价格 + 分类 */}
          {isMarket && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={label}>价格 (¥)</label>
                <input className={input} type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  placeholder="0" />
              </div>
              <div className="flex-1">
                <label className={label}>分类</label>
                <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">请选择</option>
                  {marketCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 失物招领专属：地点 */}
          {!isMarket && (
            <div>
              <label className={label}>地点</label>
              <input className={input} value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="例：图书馆三楼" />
            </div>
          )}

          {/* 详细描述 */}
          <div>
            <label className={label}>详细描述 *</label>
            <textarea className={`${input} h-28 resize-none`} value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="详细描述物品信息，便于他人识别或联系" />
          </div>

          {/* 联系方式 */}
          <div>
            <label className={label}>联系方式</label>
            <input className={input} value={contact} onChange={(e) => setContact(e.target.value)}
              placeholder="例：微信 xxx / 电话 xxx" />
          </div>

          {/* 发布按钮 */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !detail.trim()}
            className={`w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] ${
              !title.trim() || !detail.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-primary shadow-warm hover:shadow-warm-lg"
            }`}
          >
            发布
          </button>
        </div>
      </div>
    </>
  );
}

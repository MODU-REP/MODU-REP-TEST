"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Search, ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

const PRICE_DATA = [
  { id: 1, model: "VSF 126610LN", brand: "Rolex", subtitle: "Submariner Date", price: 690000, prevPrice: 668000, change: 3.2, direction: "up" as const, volume: 342, image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=100&h=100&fit=crop" },
  { id: 2, model: "Clean Daytona 116520", brand: "Rolex", subtitle: "Daytona", price: 760000, prevPrice: 774000, change: -1.8, direction: "down" as const, volume: 256, image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=100&h=100&fit=crop" },
  { id: 3, model: "ZF AP 15500", brand: "Audemars Piguet", subtitle: "Royal Oak", price: 820000, prevPrice: 788000, change: 4.1, direction: "up" as const, volume: 198, image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=100&h=100&fit=crop" },
  { id: 4, model: "Chanel CF 187 블랙 금장", brand: "Chanel", subtitle: "Classic Flap", price: 630000, prevPrice: 645000, change: -2.4, direction: "down" as const, volume: 187, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop" },
  { id: 5, model: "LV Speedy 25 모노그램", brand: "Louis Vuitton", subtitle: "Speedy", price: 350000, prevPrice: 346000, change: 1.2, direction: "up" as const, volume: 156, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop" },
  { id: 6, model: "AF Cartier Tank Must", brand: "Cartier", subtitle: "Tank", price: 420000, prevPrice: 420000, change: 0, direction: "stable" as const, volume: 134, image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=100&h=100&fit=crop" },
  { id: 7, model: "PPF Nautilus 5711", brand: "Patek Philippe", subtitle: "Nautilus", price: 950000, prevPrice: 920000, change: 3.3, direction: "up" as const, volume: 89, image: "https://images.unsplash.com/photo-1509941943102-10c232fc1571?w=100&h=100&fit=crop" },
  { id: 8, model: "Clean GMT Batman", brand: "Rolex", subtitle: "GMT Master II", price: 720000, prevPrice: 710000, change: 1.4, direction: "up" as const, volume: 212, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop" },
  { id: 9, model: "VSF Seamaster 300", brand: "Omega", subtitle: "Seamaster", price: 480000, prevPrice: 490000, change: -2.0, direction: "down" as const, volume: 167, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop" },
  { id: 10, model: "Kelly 28 Togo", brand: "Hermès", subtitle: "Kelly", price: 880000, prevPrice: 860000, change: 2.3, direction: "up" as const, volume: 78, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop" },
];

export default function PricesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "change" | "volume">("volume");

  const filtered = PRICE_DATA
    .filter((p) => p.model.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "change") return Math.abs(b.change) - Math.abs(a.change);
      return b.volume - a.volume;
    });

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-6 border-b border-white/[0.05] pb-4">
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">시세 차트</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-bold">인기 모델별 실시간 시세와 가격 변동 추이를 확인하세요.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="glass rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 mb-1">평균 시세</p>
            <p className="text-xl font-bold">₩670,000</p>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1"><TrendingUp size={10} /> +1.8%</span>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 mb-1">최고 상승</p>
            <p className="text-xl font-bold text-emerald-400">+4.1%</p>
            <span className="text-[10px] text-zinc-400 mt-1">ZF AP 15500</span>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 mb-1">최고 하락</p>
            <p className="text-xl font-bold text-red-400">-2.4%</p>
            <span className="text-[10px] text-zinc-400 mt-1">Chanel CF 187</span>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 mb-1">거래량</p>
            <p className="text-xl font-bold">1,819</p>
            <span className="text-[10px] text-zinc-400 mt-1">최근 30일</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 border-b border-white/[0.04] pb-4 w-full">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="모델명 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-[#111111] border border-white/[0.08] rounded-xl text-[11px] placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-medium text-white"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {([["volume", "거래량순"], ["price", "가격순"], ["change", "변동률순"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1 ${
                  sortBy === key 
                    ? "bg-gold text-black font-bold" 
                    : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white border border-white/[0.04]"
                }`}
              >
                <ArrowUpDown size={10} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 text-[11px] text-zinc-500 font-medium border-b border-white/[0.04]">
            <span className="w-8">#</span>
            <span>모델</span>
            <span className="text-right w-24">현재 시세</span>
            <span className="text-right w-20">변동률</span>
            <span className="text-right w-16">거래량</span>
            <span className="w-4" />
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={`/prices/${item.id}`} className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3.5 hover:bg-white/[0.02] transition-colors group">
                  <span className="w-8 text-sm font-bold text-zinc-500">{i + 1}</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.model} className="w-10 h-10 rounded-lg object-cover border border-white/[0.06] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate group-hover:text-gold transition-colors">{item.model}</p>
                      <p className="text-[10px] text-zinc-500">{item.brand} · {item.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right sm:w-24">
                    <p className="text-sm font-bold">₩{item.price.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-600 hidden sm:block">전주 ₩{item.prevPrice.toLocaleString()}</p>
                  </div>
                  <div className={`hidden sm:flex items-center justify-end gap-0.5 w-20 text-sm font-bold ${item.change > 0 ? "text-emerald-400" : item.change < 0 ? "text-red-400" : "text-zinc-500"}`}>
                    {item.change > 0 ? <TrendingUp size={12} /> : item.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                    {item.change > 0 ? "+" : ""}{item.change}%
                  </div>
                  <span className="hidden sm:block text-right w-16 text-xs text-zinc-400">{item.volume}</span>
                  <span className="hidden sm:block w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

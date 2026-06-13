"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Eye, MessageSquare, Search, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FACTORY_RANKINGS } from "@/lib/data";

const FACTORIES = [
  { id: 1, name: "VSF", rating: 4.9, qcCount: 8241, specialty: "Rolex Submariner, Seamaster", tier: "S", description: "서브마리너 최강 공장. 무브먼트 완성도 최고", reviews: 1243, trend: "up" as const },
  { id: 2, name: "Clean", rating: 4.8, qcCount: 6372, specialty: "Rolex Daytona, GMT", tier: "S", description: "데이토나 특화. 베젤 색감 최고 평가", reviews: 987, trend: "up" as const },
  { id: 3, name: "APS", rating: 4.7, qcCount: 4921, specialty: "AP Royal Oak 15202", tier: "A", description: "AP 전문 공장. 15202 베스트 옵션", reviews: 654, trend: "stable" as const },
  { id: 4, name: "ZF", rating: 4.6, qcCount: 4237, specialty: "AP, IWC, Patek", tier: "A", description: "다양한 브랜드 대응. AP 15500 추천", reviews: 543, trend: "up" as const },
  { id: 5, name: "AF", rating: 4.5, qcCount: 3112, specialty: "Cartier Tank, Santos", tier: "A", description: "까르띠에 전문. 탱크 시리즈 최고", reviews: 421, trend: "stable" as const },
  { id: 6, name: "PPF", rating: 4.5, qcCount: 2891, specialty: "Patek Nautilus, Aquanaut", tier: "A", description: "파텍 전문. 노틸러스 강추", reviews: 378, trend: "down" as const },
  { id: 7, name: "GF", rating: 4.4, qcCount: 2134, specialty: "Chanel, Cartier Ballon Bleu", tier: "B", description: "샤넬·까르띠에 가성비 옵션", reviews: 289, trend: "stable" as const },
  { id: 8, name: "BV", rating: 4.3, qcCount: 1876, specialty: "Omega Seamaster", tier: "B", description: "오메가 씨마스터 전문 공장", reviews: 234, trend: "up" as const },
];

const tierColors: Record<string, string> = {
  S: "bg-gradient-to-br from-gold to-gold-dark text-black",
  A: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
  B: "bg-gradient-to-br from-zinc-500 to-zinc-700 text-white",
};

export default function FactoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = FACTORIES.filter(
    (f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-6 border-b border-white/[0.05] pb-4">
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">공장 랭킹</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-bold">검증된 공장별 평점, 전문 분야, QC 데이터를 비교하세요.</p>
        </div>

        <div className="relative w-full sm:w-80 mb-6">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="공장명 또는 모델 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-[#111111] border border-white/[0.08] rounded-xl text-[11px] placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-medium text-white"
          />
        </div>

        {/* Top 3 Podium */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {filtered.slice(0, 3).map((factory, i) => (
            <motion.div
              key={factory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/factories/${factory.id}`} className="block glass rounded-xl p-5 card-hover group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-bl-full" />
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${i === 0 ? "rank-1" : i === 1 ? "rank-2" : "rank-3"} text-white`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xl font-black">{factory.name}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tierColors[factory.tier]}`}>TIER {factory.tier}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mb-3">{factory.description}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={12} className={s < Math.floor(factory.rating) ? "text-yellow-400" : "text-zinc-700"} fill={s < Math.floor(factory.rating) ? "currentColor" : "none"} />
                  ))}
                  <span className="text-sm font-bold text-gold ml-1">{factory.rating}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-white/[0.04]">
                  <span>QC {factory.qcCount.toLocaleString()}건</span>
                  <span>리뷰 {factory.reviews}건</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Full List */}
        <div className="glass rounded-xl overflow-hidden divide-y divide-white/[0.04]">
          {filtered.map((factory, i) => (
            <motion.div
              key={factory.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/factories/${factory.id}`} className="flex items-center gap-4 px-4 py-4 hover:bg-white/[0.02] transition-colors group">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i < 3 ? (i === 0 ? "rank-1" : i === 1 ? "rank-2" : "rank-3") + " text-white" : "bg-zinc-800 text-zinc-400"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{factory.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tierColors[factory.tier]}`}>{factory.tier}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate">{factory.specialty}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs text-zinc-400 shrink-0">
                  <span className="flex items-center gap-1"><Eye size={12} /> {factory.qcCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12} /> {factory.reviews}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={12} className="text-yellow-400" fill="currentColor" />
                  <span className="text-sm font-bold">{factory.rating}</span>
                </div>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-gold transition-colors shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

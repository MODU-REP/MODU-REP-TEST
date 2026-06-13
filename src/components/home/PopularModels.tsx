"use client";

import { motion } from "framer-motion";
import { Flame, ChevronRight } from "lucide-react";
import Link from "next/link";
import { POPULAR_MODELS } from "@/lib/data";

function RankBadge({ rank }: { rank: number }) {
  const bgClass = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "bg-zinc-700";
  return (
    <span className={`absolute top-2 left-2 w-7 h-7 ${bgClass} rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg z-10`}>
      {rank}
    </span>
  );
}

export function PopularModels() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Flame size={20} className="text-orange-400" />
          인기 모델 TOP 6
        </h2>
        <Link href="/models" className="text-xs text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors">
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {POPULAR_MODELS.map((model, index) => (
          <motion.div key={model.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.06 }}>
            <Link href={`/models/${model.id}`} className="block group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-2 border border-white/[0.06] group-hover:border-gold/25 transition-all duration-300 card-hover">
                <RankBadge rank={model.rank} />
                <img src={model.image} alt={model.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="mt-2.5 text-center">
                <p className="text-xs sm:text-sm font-bold truncate group-hover:text-gold transition-colors">{model.name}</p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{model.subtitle}</p>
                <div className="flex items-center justify-center gap-1 mt-1.5">
                  <Flame size={11} className="text-orange-400" />
                  <span className="text-[11px] text-zinc-400 font-semibold">{model.qcCount.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

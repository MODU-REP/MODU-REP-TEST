"use client";

import { motion } from "framer-motion";
import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { FACTORY_RANKINGS } from "@/lib/data";

export function FactoryRanking() {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">공장 랭킹</h3>
        <Link href="/factories" className="text-[10px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors">
          더보기 <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-2">
        {FACTORY_RANKINGS.map((factory, index) => (
          <motion.div key={factory.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.05 }}>
            <Link href={`/factories/${factory.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${factory.rank <= 3 ? (factory.rank === 1 ? "rank-1" : factory.rank === 2 ? "rank-2" : "rank-3") + " text-white" : "bg-zinc-800 text-zinc-400"}`}>
                {factory.rank}
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-3 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-gold/20 transition-colors">
                <span className="text-[10px] font-bold text-gold">{factory.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold group-hover:text-gold transition-colors">{factory.name}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={10} fill="currentColor" />
                  <span className="text-xs font-medium">{factory.rating}</span>
                </div>
                <p className="text-[10px] text-zinc-500">QC {factory.qcCount.toLocaleString()}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { PRICE_TRENDS } from "@/lib/data";

export function PriceTrends() {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">시세 트렌드</h3>
        <Link href="/prices" className="text-[10px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors">
          더보기 <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-2">
        {PRICE_TRENDS.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.05 }}>
            <Link href="/prices" className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate group-hover:text-gold transition-colors">{item.model}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <svg width="40" height="16" viewBox="0 0 40 16" className="shrink-0">
                    <path d={item.direction === "up" ? "M0,14 L8,10 L16,12 L24,6 L32,4 L40,2" : "M0,4 L8,6 L16,3 L24,8 L32,12 L40,14"} fill="none" stroke={item.direction === "up" ? "#22C55E" : "#EF4444"} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-xs font-semibold">{item.price}</p>
                <div className={`flex items-center gap-0.5 justify-end text-[10px] font-medium ${item.direction === "up" ? "trend-up" : "trend-down"}`}>
                  {item.direction === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {item.change}%
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

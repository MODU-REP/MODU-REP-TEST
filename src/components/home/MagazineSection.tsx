"use client";

import { motion } from "framer-motion";
import { Flame, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { MAGAZINE_ARTICLES } from "@/lib/data";

const badgeColors: Record<string, string> = {
  "Brand Deep-Dive": "bg-gold/10 text-gold border-gold/20",
  "Styling Guide": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Market Watch": "bg-red-500/10 text-red-400 border-red-500/20",
  "Global News": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export function MagazineSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
          <Flame size={20} className="text-gold animate-pulse" />
          추천 럭셔리 매거진
        </h2>
        <Link href="/magazine" className="text-xs text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors font-bold">
          더보기 <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {MAGAZINE_ARTICLES.slice(0, 5).map((article, index) => (
          <motion.div key={article.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.06 }}>
            <Link href={`/magazine/${article.id}`} className="block group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-2 border border-white/[0.06] group-hover:border-gold/20 transition-all duration-300 card-hover">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${badgeColors[article.badge] || "bg-zinc-800 text-zinc-300 border-zinc-700/30"}`}>
                    {article.badge}
                  </span>
                  {article.isNew && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">NEW</span>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs sm:text-xs font-black leading-snug line-clamp-2 group-hover:text-gold transition-colors text-white">{article.title}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[9px] text-zinc-500 font-bold">
                    <Clock size={10} />{article.readTime}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

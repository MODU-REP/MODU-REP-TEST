"use client";

import { motion } from "framer-motion";
import { ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { LATEST_QC } from "@/lib/data";

export function LatestQC() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold">최신 QC</h2>
        <Link href="/qc" className="text-xs text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors">
          더보기 <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {LATEST_QC.map((post, index) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.06 }}>
            <Link href={`/qc/${post.id}`} className="block group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-2 border border-white/[0.06] group-hover:border-gold/20 transition-all duration-300 card-hover">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm ${post.category === "시계" ? "bg-blue-500/70 text-white" : "bg-pink-500/70 text-white"}`}>
                  {post.category} QC
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-semibold leading-tight line-clamp-2 mb-2 group-hover:text-gold transition-colors">{post.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-medium">{post.author}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5"><MessageSquare size={9} />{post.comments}</span>
                      <span>{post.time}</span>
                    </div>
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

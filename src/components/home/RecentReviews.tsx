"use client";

import { motion } from "framer-motion";
import { Star, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { RECENT_REVIEWS } from "@/lib/data";

export function RecentReviews() {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">최근 구매후기</h3>
        <Link href="/reviews" className="text-[10px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors">
          더보기 <ChevronRight size={12} />
        </Link>
      </div>
      <div className="space-y-2.5">
        {RECENT_REVIEWS.map((review, index) => (
          <motion.div key={review.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.05 }}>
            <Link href={`/reviews/${review.id}`} className="block group p-1.5 -mx-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 mt-2 rounded-full bg-gold/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate group-hover:text-gold transition-colors">{review.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500">
                    <span>{review.author}</span>
                    <span className="flex items-center gap-0.5 text-yellow-400">
                      <Star size={9} fill="currentColor" />{review.rating}
                    </span>
                    <span className="flex items-center gap-0.5"><Eye size={9} />{review.views}</span>
                    <span>{review.time}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

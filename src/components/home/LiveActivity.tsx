"use client";

import { motion } from "framer-motion";
import { LIVE_ACTIVITIES } from "@/lib/data";

export function LiveActivity() {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold">실시간 활동</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      </div>
      <div className="space-y-3">
        {LIVE_ACTIVITIES.map((activity, index) => (
          <motion.div key={activity.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.08 }} className="flex items-start gap-2.5 p-1.5 -mx-1.5 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
            <span className="text-base shrink-0 mt-0.5">{activity.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-400 leading-relaxed">{activity.text}</p>
              <p className="text-xs font-medium text-white truncate">{activity.detail}</p>
            </div>
            <span className="text-[10px] text-zinc-600 whitespace-nowrap shrink-0">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

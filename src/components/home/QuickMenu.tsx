"use client";

import { motion } from "framer-motion";
import { BookOpen, Eye, BookText, Package, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { QUICK_MENUS } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = { BookOpen, Eye, BookText, Package, ShoppingBag, ShieldCheck };

export function QuickMenu() {
  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-sm font-bold mb-3">빠른 메뉴</h3>
      <div className="grid grid-cols-3 gap-2">
        {QUICK_MENUS.map((menu, index) => {
          const Icon = iconMap[menu.icon] || BookOpen;
          return (
            <motion.div key={menu.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, delay: index * 0.04 }}>
              <Link href="#" className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all group">
                <div className="w-9 h-9 rounded-lg bg-surface-3 border border-white/[0.06] flex items-center justify-center group-hover:border-gold/20 group-hover:bg-gold/5 transition-all">
                  <Icon size={16} className="text-zinc-400 group-hover:text-gold transition-colors" />
                </div>
                <span className="text-[10px] text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">{menu.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

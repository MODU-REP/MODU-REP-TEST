"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function PurchaseCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-gold rounded-xl p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/[0.04] rounded-full blur-2xl pointer-events-none" />
      <div className="relative flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold mb-1">원하는 모델을 찾지 못했나요?</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">구매센터를 통해 재고 및 가격을<br className="hidden sm:inline" /> 빠르게 확인해보세요.</p>
        </div>
        <Link href="/shop" className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gold text-black font-bold text-sm rounded-full hover:bg-gold-light hover:shadow-md hover:shadow-gold/20 transition-all">
          구매 문의하기 <ArrowRight size={14} />
        </Link>
      </div>
    </motion.section>
  );
}

"use client";

import { motion } from "framer-motion";
import { User, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";

export function LoginCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass rounded-xl p-5"
    >
      <div className="text-center">
        <p className="text-base font-bold mb-1">어서오세요 <span className="inline-block">&#x1F44B;</span></p>
        <p className="text-xs text-zinc-500 mb-4">로그인하고 더 많은 기능을<br />이용해보세요.</p>
        <Link href="/login" className="block w-full py-2.5 bg-gold text-black text-sm font-bold rounded-lg hover:bg-gold-light hover:shadow-md hover:shadow-gold/20 transition-all mb-3">
          로그인
        </Link>
        <Link href="/register" className="block w-full py-2.5 border border-white/10 text-sm font-medium rounded-lg hover:border-gold/30 hover:text-gold transition-colors">
          회원가입
        </Link>
      </div>
      <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-white/[0.06]">
        <Link href="/mypage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-gold transition-colors">
          <User size={18} /><span className="text-[10px]">마이페이지</span>
        </Link>
        <Link href="/notifications" className="relative flex flex-col items-center gap-1 text-zinc-500 hover:text-gold transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 right-0 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold text-white">12</span>
          <span className="text-[10px]">알림</span>
        </Link>
        <Link href="/messages" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-gold transition-colors">
          <MessageSquare size={18} /><span className="text-[10px]">메시지</span>
        </Link>
      </div>
    </motion.div>
  );
}

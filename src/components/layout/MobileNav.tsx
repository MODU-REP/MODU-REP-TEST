"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, PenLine, Users, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOBILE_NAV_ITEMS = [
  { label: "홈", icon: Home, href: "/" },
  { label: "커뮤니티", icon: Users, href: "/community" },
  { label: "글쓰기", icon: PenLine, href: "#", isSpecial: true },
  { label: "QC", icon: Camera, href: "/qc" },
  { label: "MY", icon: User, href: "/mypage" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [writeMenuOpen, setWriteMenuOpen] = useState(false);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.06]">
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {MOBILE_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href && !item.isSpecial;
            const Icon = item.icon;

            if (item.isSpecial) {
              return (
                <button
                  key={item.label}
                  onClick={() => setWriteMenuOpen(!writeMenuOpen)}
                  className="relative flex flex-col items-center justify-center z-20 shrink-0 focus:outline-none cursor-pointer"
                >
                  {/* Floating Circular Gold Button */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark text-black flex items-center justify-center shadow-lg shadow-gold/30 border-4 border-[#0A0A0A] -translate-y-4 hover:scale-105 active:scale-95 transition-all duration-200">
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black text-gold -mt-3.5">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? "text-gold" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${isActive ? "bg-gold/10" : ""}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Write Options Popover */}
      <AnimatePresence>
        {writeMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWriteMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Popover Menu box */}
            <motion.div
              initial={{ opacity: 0, y: 15, x: "-50%", scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: 15, x: "-50%", scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-20 left-1/2 w-48 bg-[#111111]/95 border border-white/[0.08] rounded-2xl p-2 shadow-2xl z-50 lg:hidden space-y-0.5 backdrop-blur-md"
            >
              <Link
                href="/community/write"
                onClick={() => setWriteMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold text-zinc-300 hover:text-gold hover:bg-white/5 transition-all duration-200"
              >
                <PenLine size={14} className="text-gold" />
                <span>커뮤니티 글쓰기</span>
              </Link>
              <Link
                href="/qc/upload"
                onClick={() => setWriteMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold text-zinc-300 hover:text-gold hover:bg-white/5 transition-all duration-200 border-t border-white/[0.04]"
              >
                <Camera size={14} className="text-gold" />
                <span>QC 판독 올리기</span>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

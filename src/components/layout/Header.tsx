"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  X,
  User,
} from "lucide-react";
import Image from "next/image";
import { NAV_ITEMS, SEARCH_TRENDING } from "@/lib/data";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="메뉴"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/" className="flex items-center group">
              <Image
                src="/logo-v2.png"
                alt="MODUREP 모두의 렙"
                width={240}
                height={94}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Center: Navigation (desktop) */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 text-sm rounded-lg transition-all duration-200 font-medium relative ${
                    isActive
                      ? "text-gold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search + Icons */}
          <div className="flex items-center gap-1.5">
            <div className="hidden md:flex items-center relative">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  className="w-52 lg:w-64 h-9 pl-9 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-full text-sm placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 focus:bg-white/[0.08] transition-all"
                />
              </div>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-72 glass rounded-xl p-3 shadow-2xl"
                  >
                    <p className="text-xs text-zinc-500 mb-2 font-medium">실시간 인기 검색어</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SEARCH_TRENDING.slice(0, 6).map((term, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-white/5 hover:bg-gold/10 hover:text-gold rounded-full cursor-pointer transition-colors border border-white/5">
                          {term}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="검색">
              <Search size={18} className="text-zinc-400" />
            </button>
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell size={18} className="text-zinc-400" />
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold px-1">12</span>
            </button>
            <button className="hidden sm:flex relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <MessageSquare size={18} className="text-zinc-400" />
            </button>
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-sm font-bold text-black ml-1 hover:shadow-lg hover:shadow-gold/20 transition-shadow">
              <User size={15} />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-white/[0.06] overflow-hidden bg-[#0A0A0A] shadow-2xl z-50">
            <nav className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2.5 text-sm rounded-lg transition-colors ${isActive ? "text-gold bg-gold/5" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

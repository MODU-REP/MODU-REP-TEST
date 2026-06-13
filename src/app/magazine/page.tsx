"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Eye, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { MAGAZINE_ARTICLES } from "@/lib/data";

const TABS = ["전체", "브랜드 역사", "라이프스타일", "마켓 워치", "글로벌 뉴스"];

export default function MagazinePage() {
  const [activeTab, setActiveTab] = useState("전체");

  const filtered = activeTab === "전체" 
    ? MAGAZINE_ARTICLES 
    : MAGAZINE_ARTICLES.filter((a) => a.category === activeTab);

  return (
    <div className="min-h-screen">
      {/* Magazine Hero Cover */}
      <div className="relative py-20 border-b border-white/[0.05] overflow-hidden bg-black">
        <div className="absolute inset-0 bg-radial-gradient from-gold/5 via-transparent to-transparent opacity-50" />
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 relative z-10 text-center">
          <span className="text-[11px] font-black tracking-[0.3em] text-gold uppercase">luxury lifestyle &amp; horology</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-3 mb-4 font-sans uppercase">
            모두의렙 매거진
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            명품 브랜드의 역사적 유산부터 럭셔리 라이프스타일 스타일링, 글로벌 시계 시황 트렌드까지 하이엔드 오피니언 리더들의 깊이 있는 칼럼을 만나보세요.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        
        {/* Category Navigation */}
        <div className="flex gap-1.5 mb-8 overflow-x-auto hide-scrollbar pb-1 border-b border-white/[0.04]">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? "bg-gold text-black shadow-lg shadow-gold/15" 
                  : "bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/[0.03]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Featured Stories (First 2) */}
        {filtered.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {filtered.slice(0, 2).map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={`/magazine/${article.id}`} className="block glass rounded-2xl overflow-hidden card-hover group border border-white/[0.06] bg-[#111111]/40">
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="text-[9px] font-black px-2.5 py-0.5 rounded bg-gold text-black tracking-wide uppercase">
                        {article.badge}
                      </span>
                      {article.isNew && (
                        <span className="text-[9px] font-black px-2.5 py-0.5 rounded bg-red-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5">
                      <span className="text-[9px] font-bold text-gold uppercase tracking-wider block mb-1">
                        {article.category}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white leading-tight group-hover:text-gold transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mt-2 font-medium leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-[10px] text-zinc-500 font-bold border-t border-white/[0.06] pt-3">
                        <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                        <span className="flex items-center gap-1"><Eye size={12} /> {article.views.toLocaleString()} 읽음</span>
                        <span className="ml-auto flex items-center gap-0.5 text-gold group-hover:translate-x-1 transition-transform">
                          칼럼 읽기 <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Regular Article Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(2).map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link href={`/magazine/${article.id}`} className="block glass rounded-2xl overflow-hidden card-hover group border border-white/[0.05] bg-[#111111]/30 flex flex-col h-full justify-between">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[8px] font-black px-2 py-0.5 rounded bg-black/60 text-zinc-300 backdrop-blur-sm tracking-wide uppercase">
                        {article.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[9px] font-bold text-gold uppercase tracking-wider block mb-1">
                      {article.category}
                    </span>
                    <h3 className="text-[13px] sm:text-[14px] font-black text-white leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-zinc-400 text-[11px] line-clamp-2 mt-2 font-medium leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between text-[9px] text-zinc-500 font-bold border-t border-white/[0.04] pt-3 mt-2">
                    <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                    <span className="flex items-center gap-1"><Eye size={10} /> {article.views.toLocaleString()} 읽음</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-bold text-sm">
            준비된 칼럼이 없습니다.
          </div>
        )}

      </div>
    </div>
  );
}

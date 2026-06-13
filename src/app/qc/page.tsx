"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Eye, MessageSquare, Clock, Search, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { QC_POSTS } from "@/lib/data";

const TABS = ["전체", "시계", "가방"];
const TYPE_FILTERS = ["전체", "QC", "GL", "RL"];

const typeColors: Record<string, string> = {
  QC: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  GL: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  RL: "bg-red-500/20 text-red-400 border-red-500/20",
};

export default function QCPage() {
  const [category, setCategory] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [search, setSearch] = useState("");

  const filtered = QC_POSTS.filter((item) => {
    const matchCat = category === "전체" || item.category === category;
    const matchType = typeFilter === "전체" || item.type === typeFilter;
    const matchSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.factory.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QC 갤러리 &amp; 판독 연구소</h1>
            <p className="text-sm text-zinc-500 mt-1">
              공장에서 갓 도착한 출고(QC) 사진들을 정밀 검증하고, 회원들과 함께 합격(GL) 또는 재요청(RL) 의견을 나눠보세요.
            </p>
          </div>
          <Link href="/qc/upload" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-black text-sm font-bold rounded-full hover:bg-gold-light transition-all duration-300">
            <Camera size={14} /> QC 올리기
          </Link>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 border-b border-white/[0.04] pb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="모델명, 공장명 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-bold text-white"
              />
            </div>
            
            {/* Watch/Bag Category Filter */}
            <div className="flex gap-1">
              {TABS.map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setCategory(tab)} 
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                    category === tab 
                      ? "bg-gold text-black shadow-sm" 
                      : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] border border-white/[0.04]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* QC / GL / RL Type Filter */}
          <div className="flex gap-1 items-center bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl">
            {TYPE_FILTERS.map((t) => (
              <button 
                key={t} 
                onClick={() => setTypeFilter(t)} 
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                  typeFilter === t 
                    ? "bg-white/10 text-white" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* QC Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link href={`/qc/${item.id}`} className="block glass rounded-2xl overflow-hidden card-hover group border border-white/[0.05] bg-[#111111]/30">
                <div className="relative aspect-square overflow-hidden bg-zinc-950">
                  <img 
                    src={item.images[0]} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Status tag */}
                  <span className={`absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded border backdrop-blur-md ${
                    typeColors[item.type] || "bg-zinc-700/80 text-zinc-300 border-zinc-600/30"
                  }`}>
                    {item.type}
                  </span>
                  
                  {/* Category badge */}
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-zinc-400 backdrop-blur-sm">
                    {item.category}
                  </span>
                  
                  {/* Factory overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="text-[9px] font-bold text-gold uppercase tracking-wider block">
                      {item.factory}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xs font-black text-white group-hover:text-gold transition-colors truncate mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 truncate font-semibold">
                    {item.model}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3 text-[9px] text-zinc-500 font-bold border-t border-white/[0.04] pt-3">
                    <span>{item.author}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5"><Eye size={10} /> {item.views}</span>
                      <span className="flex items-center gap-0.5"><MessageSquare size={10} /> {item.commentsCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[9px] text-zinc-600 font-bold">
                    <span>{item.time}</span>
                    <span className="text-gold flex items-center gap-1">
                      GL {item.glVotes} • RL {item.rlVotes}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-bold text-xs">
            검색 결과와 일치하는 QC 게시글이 없습니다.
          </div>
        )}

        {/* Mobile Upload Button */}
        <div className="flex justify-end mt-4 sm:hidden">
          <Link href="/qc/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-black text-xs font-black rounded-full shadow-lg">
            <Camera size={13} /> QC 올리기
          </Link>
        </div>
      </div>
    </div>
  );
}

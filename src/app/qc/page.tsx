"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Eye, Search, CheckCircle2, XCircle, HelpCircle, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { QC_POSTS } from "@/lib/data";

const TABS = ["전체", "시계", "가방"];
const TYPE_FILTERS = ["전체", "QC", "GL", "RL"];

export default function QCPage() {
  const [category, setCategory] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    let loaded = QC_POSTS;
    const stored = localStorage.getItem("qc_posts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        loaded = [...parsed, ...QC_POSTS];
      } catch (e) {
        loaded = QC_POSTS;
      }
    } else {
      localStorage.setItem("qc_posts", JSON.stringify([]));
    }
    setPosts(loaded);
  }, []);

  const filtered = posts.filter((item) => {
    const matchCat = category === "전체" || item.category === category;
    const matchType = typeFilter === "전체" || item.type === typeFilter;
    const matchSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.factory.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        
        {/* Header */}
        <div className="mb-6 border-b border-white/[0.05] pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">QC 투표</h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-bold">
              공장에서 갓 도착한 출고(QC) 사진들을 정밀 검증하고, 회원들과 함께 합격(GL) 또는 재요청(RL) 의견을 나눠보세요.
            </p>
          </div>
        </div>

        {/* Purchase Guide Banner */}
        <Link 
          href="/community?tab=구매 가이드"
          className="block mb-6 relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group hover:border-gold/40 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                안전하고 확실한 렙 입문! 모두의 렙 안심 구매 가이드
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 font-black animate-pulse">필독</span>
              </h4>
              <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 font-medium">
                실패 없는 안전결제 신청부터 항공 직배송, 48시간 실물 검수 진행 방식을 설명해 드립니다.
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-gold font-bold gap-1 self-end sm:self-auto group-hover:translate-x-1 transition-transform">
            가이드 보기 <ChevronRight size={14} />
          </div>
        </Link>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 border-b border-white/[0.04] pb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="모델명, 공장명 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[11px] placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-medium text-white"
              />
            </div>
            
            {/* Watch/Bag Category Filter */}
            <div className="flex flex-wrap gap-1">
              {TABS.map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setCategory(tab)} 
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 ${
                    category === tab 
                      ? "bg-gold text-black font-bold" 
                      : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white border border-white/[0.04]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* QC / GL / RL Type Filter */}
          <div className="flex flex-wrap gap-1 items-center bg-white/[0.02] border border-white/[0.04] p-1 rounded-xl">
            {TYPE_FILTERS.map((t) => (
              <button 
                key={t} 
                onClick={() => setTypeFilter(t)} 
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all duration-200 ${
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

        {/* QC List Layout (Unified compact list style) */}
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.05] bg-[#111111]/30 shadow-xl p-3 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item, i) => {
              const statusStyle = 
                item.type === "GL" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : item.type === "RL" 
                  ? "bg-red-500/10 text-red-400 border-red-500/20" 
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20";
              
              const StatusIcon = 
                item.type === "GL" 
                  ? CheckCircle2 
                  : item.type === "RL" 
                  ? XCircle 
                  : HelpCircle;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                >
                  <Link
                    href={`/qc/${item.id}`}
                    className="w-full min-w-0 flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors group cursor-pointer border border-transparent hover:border-white/[0.02]"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[8px] font-black border px-1 rounded flex items-center gap-0.5 ${statusStyle}`}>
                          <StatusIcon size={8} /> {item.type}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold">
                          {item.factory}
                        </span>
                        <span className="text-[8px] font-bold text-zinc-500 bg-white/[0.03] border border-white/[0.06] px-1.5 py-0.25 rounded">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-semibold text-zinc-200 group-hover:text-gold transition-colors line-clamp-2 whitespace-normal break-all mt-1 leading-tight">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 text-[8.5px] text-zinc-500 font-bold">
                        <span>{item.author}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Eye size={10} /> {item.views}
                        </span>
                        <span className="ml-auto text-gold flex items-center gap-0.5">
                          GL {item.glVotes} • RL {item.rlVotes}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Board Controls */}
        <div className="hidden sm:flex items-center justify-end mt-4">
          <Link 
            href="/qc/upload" 
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gold text-black text-[11px] font-black rounded-lg hover:bg-gold-light hover:shadow-md hover:shadow-gold/20 transition-all"
          >
            <Camera size={12} /> QC 글쓰기
          </Link>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-bold text-xs">
            검색 결과와 일치하는 QC 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

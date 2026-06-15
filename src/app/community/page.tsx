"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  Flame, 
  ChevronRight, 
  TrendingUp, 
  Star, 
  Search, 
  PenLine, 
  Image as ImageIcon,
  ShieldCheck,
  Plane,
  Clock,
  CheckSquare,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { COMMUNITY_POSTS, COMMUNITY_NOTICES, POPULAR_MODELS, SEARCH_TRENDING, FACTORY_RANKINGS, CommunityPost } from "@/lib/data";

const TABS = ["전체", "초보 가이드", "구매 가이드", "인기 글", "정보", "Q&A", "자유"];
const categoryColors: Record<string, string> = {
  "초보 가이드": "bg-white/[0.03] text-zinc-400 border-white/[0.06]",
  "구매 가이드": "bg-gold/10 text-gold border-gold/20",
  "인기 글": "bg-gold/10 text-gold border-gold/20",
  "정보": "bg-white/[0.03] text-zinc-400 border-white/[0.06]",
  "자유": "bg-white/[0.03] text-zinc-400 border-white/[0.06]",
  "Q&A": "bg-white/[0.03] text-zinc-400 border-white/[0.06]"
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 50;

  // 로컬 저장소 연동 포스트 상태
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // 검색 상태
  const [searchType, setSearchType] = useState("제목+내용");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState({ type: "제목+내용", query: "" });

  useEffect(() => {
    const stored = localStorage.getItem("community_posts");
    if (stored) {
      try {
        let parsed = JSON.parse(stored) as CommunityPost[];
        let migrated = false;
        parsed = parsed.map(post => {
          if (post.category === "후기" as any) {
            post.category = "정보";
            migrated = true;
          } else if (post.category === "배송" as any || post.category === "구매/판매" as any) {
            post.category = "자유";
            migrated = true;
          }
          return post;
        });
        if (migrated) {
          localStorage.setItem("community_posts", JSON.stringify(parsed));
        }
        setPosts(parsed);
      } catch (e) {
        setPosts(COMMUNITY_POSTS);
      }
    } else {
      localStorage.setItem("community_posts", JSON.stringify(COMMUNITY_POSTS));
      setPosts(COMMUNITY_POSTS);
    }

    // URL 쿼리 파라미터 연동
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam && TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch({ type: searchType, query: searchQuery });
    setCurrentPage(1);
  };

  // 포스트 필터링 로직 (탭 및 검색 반영)
  const filteredPosts = posts.filter((post) => {
    // 1. 카테고리 필터
    const matchesTab = activeTab === "전체" 
      ? true 
      : activeTab === "인기 글"
      ? post.hot
      : post.category === activeTab;
    
    if (!matchesTab) return false;

    // 2. 검색어 필터
    if (!activeSearch.query.trim()) return true;
    
    const query = activeSearch.query.toLowerCase();
    if (activeSearch.type === "제목+내용") {
      return post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query);
    } else if (activeSearch.type === "제목") {
      return post.title.toLowerCase().includes(query);
    } else if (activeSearch.type === "내용") {
      return post.content.toLowerCase().includes(query);
    } else if (activeSearch.type === "글쓴이") {
      return post.author.toLowerCase().includes(query);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-6 border-b border-white/[0.05] pb-4">
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">커뮤니티</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-bold">공장별 렙 분석 정보, 후기, 세관/배송 고민 등 레플리카 매니아들의 은밀한 대화방.</p>
        </div>

        {/* Purchase Guide Banner */}
        <div 
          onClick={() => setActiveTab("구매 가이드")}
          className="cursor-pointer mb-5 relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group hover:border-gold/40 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                사기 피해 0% 보장! 모두의 렙 안심 구매 가이드
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 font-black animate-pulse">필독</span>
              </h4>
              <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 font-medium">
                안전결제 대금 보관부터 1:1 항공 특송, 48시간 실물 안심 검수까지 전 과정을 한눈에 확인하세요.
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-gold font-bold gap-1 self-end sm:self-auto group-hover:translate-x-1 transition-transform">
            가이드 보기 <ChevronRight size={14} />
          </div>
        </div>

        {/* Notices */}
        <div className="glass rounded-xl p-4 mb-5 border border-white/[0.05]">
          <div className="space-y-2">
            {COMMUNITY_NOTICES.map((notice) => (
              <Link key={notice.id} href="#" className="flex items-center justify-between group block">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/10 shrink-0">공지</span>
                  <span className="text-xs sm:text-sm text-zinc-300 group-hover:text-gold transition-colors truncate">{notice.title}</span>
                </div>
                <span className="text-[10px] text-zinc-600 shrink-0 ml-4 font-bold">{notice.date}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Main List */}
          <div>
            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4 pb-2 border-b border-white/[0.04]">
              {TABS.map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }} 
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs md:text-sm font-bold rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab 
                      ? "bg-gold text-black font-bold" 
                      : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white border border-white/[0.04]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Post Listings or Purchase Guide (Optimized Responsive Layout) */}
            {activeTab === "구매 가이드" ? (
              <div className="glass rounded-2xl p-6 sm:p-8 border border-white/[0.05] bg-[#111111]/20 shadow-xl space-y-6 text-zinc-300">
                <div className="flex items-center gap-3 mb-6 border-b border-white/[0.05] pb-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">모두의 렙 안심 구매 가이드</h2>
                    <p className="text-xs text-zinc-400 font-bold mt-0.5">해외 직구 사기 리스크 0%, 항공 직배송으로 가장 빠르고 안전하게 구매하는 절차를 안내합니다.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-black shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">
                        <CreditCard size={15} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-gold uppercase tracking-wider block">STEP 01</span>
                        <h4 className="text-sm font-black text-white">제품 선택 및 안전결제 신청</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                          커뮤니티의 다양한 정보와 브랜드/공장 가이드를 확인하여 원하는 제품을 선택한 후, 모두의 렙 <span className="text-gold font-bold">안전결제</span> 서비스를 통해 구매를 진행합니다.
                        </p>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.03] text-[10px] text-zinc-500 leading-relaxed font-bold mt-2">
                          🛡️ <span className="text-gold font-bold">안심 정산 보증:</span> 구매자가 결제한 금액은 판매자에게 즉시 정산되지 않고, 제품을 실제로 받아보고 48시간의 안심 검수가 끝날 때까지 모두의 렙 안전 지갑에 보관되어 먹튀 사기를 100% 차단합니다.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-black shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">
                        <Search size={15} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-gold uppercase tracking-wider block">STEP 02</span>
                        <h4 className="text-sm font-black text-white">현지 제품 수배 및 대기</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                          주문이 완료되면 본사에서 중국 현지 5대 메이저 TD(신뢰 중개인)를 직접 통제하여 양질의 제품 개체를 확보하기 위한 전문 수배에 들어갑니다.
                        </p>
                        <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-500 leading-relaxed font-bold mt-2">
                          ⚠️ <span className="font-black">현지 수배 기간 안내:</span> 공장 출고 및 QC 사진 준비는 영업일 기준 평균 3~7일이 소요됩니다. 다만, 공장의 일시 품절이나 신규 리오더(재제작) 상황에 따라 추가적인 수배 대기 시간이 발생할 수 있습니다.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-black shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">
                        <CheckSquare size={15} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-gold uppercase tracking-wider block">STEP 03</span>
                        <h4 className="text-sm font-black text-white">정밀 QC 확인 및 회원 투표</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                          현지에서 출고된 제품의 고해상도 QC 사진이 준비되면 QC 게시판에 업로드하여 다른 유저들의 집단지성 투표 의견을 통해 발송 여부를 최종 판단합니다.
                        </p>
                        <div className="flex gap-4 text-[10px] text-zinc-500 font-bold mt-2 bg-black/20 p-2 rounded-lg border border-white/[0.02]">
                          <span>• <span className="text-emerald-400 font-black">GL (합격)</span>: 외형 하자가 없어 발송을 확정합니다.</span>
                          <span>• <span className="text-red-400 font-black">RL (불합격)</span>: 흠결이 발견되어 즉시 현지 교체(재수배)를 요청합니다.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-black shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">
                        <Plane size={15} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-gold uppercase tracking-wider block">STEP 04</span>
                        <h4 className="text-sm font-black text-white">1:1 항공 특송 및 당일 택배 발송</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                          QC 투표 결과 합격(GL) 처리된 개체는 다음 날 즉시 비행기 배송(항공 직배송 라인)을 통해 출발하며, 평균 1~2일 만에 국내에 빠르게 입국합니다.
                        </p>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.03] text-[10px] text-zinc-500 leading-relaxed font-bold mt-2">
                          ✈️ 인천공항 세관 통관 즉시 우체국 택배 또는 국내 주요 택배사를 통해 송장이 등록되고, 지체 없이 당일 고객님의 자택으로 발송됩니다.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-black shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">
                        <Clock size={15} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-gold uppercase tracking-wider block">STEP 05</span>
                        <h4 className="text-sm font-black text-white">수령 및 48시간 안심 검수 기간 보장</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                          제품을 배송받으신 순간부터 직접 하자를 꼼꼼히 확인하고 불량 여부를 검수할 수 있는 **48시간의 실물 안심 검수 기간**을 완벽 보장합니다.
                        </p>
                        <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 leading-relaxed font-bold mt-2">
                          🛡️ 수령 후 48시간 이내에 제품 교환/환불 요청 등의 이의 제기가 없는 경우에만 에스크로 보관 대금이 판매자에게 정상 정산되어 안심하고 제품을 소장할 수 있습니다.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl overflow-hidden border border-white/[0.05] bg-[#111111]/30 shadow-xl">
                {/* Mobile View: Vertical list cards to prevent table sizing and clipping bugs */}
                <div className="block sm:hidden divide-y divide-white/[0.04] text-[11px] font-bold">
                  {paginatedPosts.map((post) => (
                    <div key={post.id} className="px-3 py-3 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex items-start gap-1 min-w-0 w-full mb-1">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/[0.03] shrink-0 mt-0.5 ${categoryColors[post.category] || "bg-zinc-800 text-zinc-300"}`}>
                          {post.category}
                        </span>
                        {post.hot && <Flame size={11} className="text-orange-400 shrink-0 mt-0.5" />}
                        <Link 
                          href={`/community/${post.id}`} 
                          className="text-zinc-200 hover:text-gold font-semibold transition-colors whitespace-normal break-words min-w-0 flex-1 text-[11px] leading-tight"
                        >
                          {post.title}
                        </Link>
                        {post.comments > 0 && (
                          <span className="text-[9px] text-red-400 font-black shrink-0 mt-0.5">
                            [{post.comments}]
                          </span>
                        )}
                        {post.hasImage && (
                          <ImageIcon size={11} className="text-zinc-500 shrink-0 ml-0.5 mt-0.5" />
                        )}
                      </div>
                      {/* Mobile Info row */}
                      <div className="flex items-center flex-wrap gap-1.5 text-[8.5px] text-zinc-500 font-bold">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                        <span>•</span>
                        <span>조회 {post.views}</span>
                        <span>•</span>
                        <span className="text-gold">추천 {post.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Full size table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-black text-zinc-400 uppercase tracking-wider">
                        <th className="py-3 px-4 text-center w-16">번호</th>
                        <th className="py-3 px-4">제목</th>
                        <th className="py-3 px-4 text-center w-24">글쓴이</th>
                        <th className="py-3 px-4 text-center w-20">작성일</th>
                        <th className="py-3 px-4 text-center w-16">조회</th>
                        <th className="py-3 px-4 text-center w-16">추천</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-xs font-bold">
                      <AnimatePresence mode="popLayout">
                        {paginatedPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                            {/* 번호 */}
                            <td className="py-3 px-4 text-center text-zinc-500">
                              {post.id}
                            </td>
                            {/* 제목 */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/[0.03] ${categoryColors[post.category] || "bg-zinc-800 text-zinc-300"}`}>
                                  {post.category}
                                </span>
                                {post.hot && <Flame size={12} className="text-orange-400 shrink-0" />}
                                <Link 
                                  href={`/community/${post.id}`} 
                                  className="text-zinc-200 hover:text-gold font-bold transition-colors truncate max-w-[420px]"
                                >
                                  {post.title}
                                </Link>
                                {post.comments > 0 && (
                                  <span className="text-[10px] text-red-400 font-black shrink-0">
                                    [{post.comments}]
                                  </span>
                                )}
                                {post.hasImage && (
                                  <ImageIcon size={12} className="text-zinc-500 shrink-0 ml-1" />
                                )}
                              </div>
                            </td>
                            {/* 글쓴이 */}
                            <td className="py-3 px-4 text-center text-zinc-400 font-medium truncate max-w-[100px]">
                              {post.author}
                            </td>
                            {/* 작성일 */}
                            <td className="py-3 px-4 text-center text-zinc-500 font-medium">
                              {post.time}
                            </td>
                            {/* 조회수 */}
                            <td className="py-3 px-4 text-center text-zinc-500 font-medium">
                              {post.views}
                            </td>
                            {/* 추천수 */}
                            <td className="py-3 px-4 text-center text-gold font-black">
                              {post.likes}
                            </td>
                          </tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-20 text-zinc-600 font-bold text-xs">
                    등록된 게시글이 없습니다.
                  </div>
                )}
              </div>
            )}

            {activeTab !== "구매 가이드" && (
              <>
                {/* Board Controls */}
                <div className="hidden sm:flex items-center justify-end mt-4">
                  <Link 
                    href="/community/write" 
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gold text-black text-[11px] font-black rounded-lg hover:bg-gold-light hover:shadow-md hover:shadow-gold/20 transition-all"
                  >
                    <PenLine size={12} /> 글쓰기
                  </Link>
                </div>

                {/* Pagination (실제 작동하는 페이징) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8 text-xs font-bold text-zinc-500">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className="hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer disabled:cursor-not-allowed"
                      disabled={currentPage === 1}
                      aria-label="이전 페이지"
                    >
                      ◀
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-1.5 py-0.5 cursor-pointer transition-colors ${
                          currentPage === page 
                            ? "text-gold border-b-2 border-gold font-black" 
                            : "hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className="hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer disabled:cursor-not-allowed"
                      disabled={currentPage === totalPages}
                      aria-label="다음 페이지"
                    >
                      ▶
                    </button>
                  </div>
                )}

                {/* Centered Board Search (실제 필터링 작동) */}
                <form onSubmit={handleSearchSubmit} className="flex items-center justify-center gap-1 mt-6 w-full max-w-md mx-auto px-1">
                  <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="h-9 px-2.5 bg-[#111111] border border-white/[0.08] rounded-xl text-[11px] text-white focus:outline-none focus:border-gold/30 font-black cursor-pointer"
                  >
                    <option value="제목+내용" className="bg-[#111111] text-white">제목+내용</option>
                    <option value="제목" className="bg-[#111111] text-white">제목</option>
                    <option value="내용" className="bg-[#111111] text-white">내용</option>
                    <option value="글쓴이" className="bg-[#111111] text-white">글쓴이</option>
                  </select>
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="검색어를 입력하세요..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-3 pr-9 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[11px] placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-medium text-white" 
                    />
                    <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-gold transition-colors" aria-label="검색">
                      <Search size={14} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            
            {/* Purchase Guide Sidebar Widget */}
            <div 
              onClick={() => {
                setActiveTab("구매 가이드");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="glass rounded-xl p-4 border border-gold/20 bg-gradient-to-b from-gold/10 to-transparent cursor-pointer group hover:border-gold/40 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2 text-white">
                <ShieldCheck size={16} className="text-gold animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wide">
                  렙 초보 안심 구매 가이드
                </h3>
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold leading-relaxed">
                먹튀 사기 0%, 항공 직배송, 수령 후 48시간 실물 안심 검수제도! 모두의 렙만의 특화된 구매 여정을 안내합니다.
              </p>
              <div className="mt-3 flex items-center justify-between text-[9px] font-black text-gold uppercase tracking-wider">
                <span>가이드 자세히 보기</span>
                <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-white/[0.05] bg-[#111111]/30">
              <h3 className="text-xs font-black mb-3 flex items-center gap-1.5 uppercase tracking-wide text-white">
                <TrendingUp size={14} className="text-gold" /> 실시간 인기 글
              </h3>
              <div className="space-y-2.5">
                {posts.filter(p => p.hot).slice(0, 3).map((post, i) => (
                  <Link key={post.id} href={`/community/${post.id}`} className="flex items-start gap-2 text-xs hover:text-gold transition-colors block">
                    <span className="w-4 text-center font-bold text-gold shrink-0">{i + 1}</span>
                    <span className="truncate text-zinc-300 font-bold group-hover:text-gold">{post.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-white/[0.05] bg-[#111111]/30">
              <h3 className="text-xs font-black mb-3 uppercase tracking-wide text-white">실시간 검색어</h3>
              <div className="flex flex-wrap gap-1.5">
                {SEARCH_TRENDING.map((term, i) => (
                  <span 
                    key={i} 
                    onClick={() => {
                      setSearchQuery(term);
                      setActiveSearch({ type: "제목+내용", query: term });
                      setCurrentPage(1);
                    }}
                    className="text-[10px] px-2.5 py-1 bg-white/[0.03] hover:bg-gold/10 hover:text-gold rounded-full cursor-pointer transition-colors border border-white/[0.04] text-zinc-400 font-bold"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-white/[0.05] bg-[#111111]/30">
              <h3 className="text-xs font-black mb-3 flex items-center gap-1.5 uppercase tracking-wide text-white">
                <Star size={14} className="text-gold" /> 공장 랭킹
              </h3>
              <div className="space-y-2">
                {FACTORY_RANKINGS.slice(0, 5).map((f) => (
                  <div key={f.id} className="flex items-center justify-between text-xs font-bold text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                        f.rank === 1 ? "bg-gradient-to-br from-[#FFD700] to-[#CC9900] text-black" : 
                        f.rank === 2 ? "bg-zinc-600 text-black" : 
                        "bg-zinc-800 text-zinc-400"
                      }`}>{f.rank}</span>
                      <span className="font-bold">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      <Star size={9} fill="currentColor" />
                      <span>{f.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

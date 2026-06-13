"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Eye, ThumbsUp, Flame, ChevronRight, TrendingUp, Star, Search, PenLine, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { COMMUNITY_POSTS, COMMUNITY_NOTICES, POPULAR_MODELS, SEARCH_TRENDING, FACTORY_RANKINGS, CommunityPost } from "@/lib/data";

const TABS = ["전체", "초보 가이드", "인기 글", "정보", "Q&A", "자유"];
const categoryColors: Record<string, string> = {
  "초보 가이드": "bg-white/[0.03] text-zinc-400 border-white/[0.06]",
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
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
        <div className="mb-6 border-b border-white/[0.05] pb-4">
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">커뮤니티</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-bold">공장별 렙 분석 정보, 후기, 세관/배송 고민 등 레플리카 매니아들의 은밀한 대화방.</p>
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
            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar pb-1 border-b border-white/[0.04]">
              {TABS.map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }} 
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab 
                      ? "bg-gold text-black font-bold" 
                      : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white border border-white/[0.04]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Post Listings (DCInside Table Style) */}
            <div className="glass rounded-2xl overflow-hidden border border-white/[0.05] bg-[#111111]/30 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-black text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-4 text-center w-16 hidden sm:table-cell">번호</th>
                      <th className="py-3 px-4">제목</th>
                      <th className="py-3 px-4 text-center w-24 hidden sm:table-cell">글쓴이</th>
                      <th className="py-3 px-4 text-center w-20 hidden sm:table-cell">작성일</th>
                      <th className="py-3 px-4 text-center w-16 hidden sm:table-cell">조회</th>
                      <th className="py-3 px-4 text-center w-16 hidden sm:table-cell">추천</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-xs font-bold">
                    <AnimatePresence mode="popLayout">
                      {paginatedPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                          {/* 번호 */}
                          <td className="py-3 px-4 text-center text-zinc-500 hidden sm:table-cell">
                            {post.id}
                          </td>
                          {/* 제목 */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/[0.03] ${categoryColors[post.category] || "bg-zinc-800 text-zinc-300"}`}>
                                {post.category}
                              </span>
                              {post.hot && <Flame size={12} className="text-orange-400 shrink-0" />}
                              <Link 
                                href={`/community/${post.id}`} 
                                className="text-zinc-200 hover:text-gold font-bold transition-colors truncate max-w-[280px] xs:max-w-[340px] md:max-w-[420px]"
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
                            
                            {/* Mobile Info row */}
                            <div className="sm:hidden flex items-center gap-2 mt-1.5 text-[9px] text-zinc-500 font-bold">
                              <span>{post.author}</span>
                              <span>•</span>
                              <span>{post.time}</span>
                              <span>•</span>
                              <span>조회 {post.views}</span>
                              <span>•</span>
                              <span className="text-gold">추천 {post.likes}</span>
                            </div>
                          </td>
                          {/* 글쓴이 */}
                          <td className="py-3 px-4 text-center text-zinc-400 hidden sm:table-cell font-medium truncate max-w-[100px]">
                            {post.author}
                          </td>
                          {/* 작성일 */}
                          <td className="py-3 px-4 text-center text-zinc-500 hidden sm:table-cell font-medium">
                            {post.time}
                          </td>
                          {/* 조회수 */}
                          <td className="py-3 px-4 text-center text-zinc-500 hidden sm:table-cell font-medium">
                            {post.views}
                          </td>
                          {/* 추천수 */}
                          <td className="py-3 px-4 text-center text-gold hidden sm:table-cell font-black">
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

            {/* Board Controls */}
            <div className="flex items-center justify-end mt-4">
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
            <form onSubmit={handleSearchSubmit} className="flex items-center justify-center gap-1.5 mt-6 max-w-md mx-auto">
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="h-9 px-3 bg-[#111111] border border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-gold/30 font-black cursor-pointer"
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
                  className="w-full h-9 pl-3 pr-9 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-bold text-white" 
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-gold transition-colors" aria-label="검색">
                  <Search size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-4">
            
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

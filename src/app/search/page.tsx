"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, TrendingUp, Clock, X, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SEARCH_TRENDING, COMMUNITY_POSTS, POPULAR_MODELS, CommunityPost } from "@/lib/data";

const RECENT_SEARCHES = ["VSF 서브마리너", "Clean Daytona QC", "통관 기간"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    let loadedPosts = COMMUNITY_POSTS;
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
        loadedPosts = parsed;
      } catch (e) {
        loadedPosts = COMMUNITY_POSTS;
      }
    } else {
      localStorage.setItem("community_posts", JSON.stringify(COMMUNITY_POSTS));
    }
    setPosts(loadedPosts);
  }, []);

  const hasQuery = query.trim().length > 0;

  const filteredPosts = posts.filter(
    (p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.author.toLowerCase().includes(query.toLowerCase())
  );

  const filteredModels = POPULAR_MODELS.filter(
    (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-[800px] mx-auto px-3 sm:px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="모델명, 공장, 키워드로 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-10 pl-11 pr-10 bg-[#111111] border border-white/[0.08] rounded-xl text-[11px] placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-medium text-white"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-full">
              <X size={16} className="text-zinc-500" />
            </button>
          )}
        </div>

        {!hasQuery ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wider"><Clock size={14} className="text-zinc-400" /> 최근 검색</h3>
                  <button onClick={() => setRecentSearches([])} className="text-[11px] text-zinc-500 hover:text-zinc-300">전체 삭제</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button key={i} onClick={() => setQuery(term)} className="text-xs px-3 py-1.5 bg-white/[0.04] hover:bg-gold/10 hover:text-gold rounded-full border border-white/[0.06] transition-colors">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending */}
            <div className="mb-6">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5 mb-3 uppercase tracking-wider"><TrendingUp size={14} className="text-gold" /> 실시간 인기 검색어</h3>
              <div className="glass rounded-xl p-4">
                <div className="grid grid-cols-2 gap-2">
                  {SEARCH_TRENDING.map((term, i) => (
                    <button key={i} onClick={() => setQuery(term)} className="flex items-center gap-2 text-sm hover:text-gold transition-colors text-left py-1">
                      <span className={`w-5 text-center text-xs font-bold ${i < 3 ? "text-gold" : "text-zinc-500"}`}>{i + 1}</span>
                      <span className="truncate">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Models */}
            <div>
              <h3 className="text-sm font-black text-white mb-3 uppercase tracking-wider">인기 모델</h3>
              <div className="grid grid-cols-3 gap-3">
                {POPULAR_MODELS.slice(0, 6).map((model) => (
                  <Link key={model.id} href={`/models/${model.id}`} className="glass rounded-xl p-3 text-center card-hover group">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border border-white/[0.06]">
                      <img src={model.image} alt={model.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="text-[11px] font-bold truncate">{model.name}</p>
                    <p className="text-[9px] text-zinc-500">{model.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Search Results */}
            {filteredModels.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-black text-white mb-3 uppercase tracking-wider">모델 ({filteredModels.length})</h3>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {filteredModels.map((model) => (
                    <Link key={model.id} href={`/models/${model.id}`} className="glass rounded-xl p-3 shrink-0 w-32 text-center card-hover group">
                      <div className="w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden border border-white/[0.06]">
                        <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] font-bold truncate">{model.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-black text-white mb-3 uppercase tracking-wider">게시글 ({filteredPosts.length})</h3>
              {filteredPosts.length > 0 ? (
                <div className="glass rounded-xl divide-y divide-white/[0.04]">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/community/${post.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{post.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                          <span>{post.author}</span>
                          <span className="flex items-center gap-0.5"><Eye size={9} />{post.views}</span>
                          <span className="flex items-center gap-0.5"><MessageSquare size={9} />{post.comments}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-xl p-8 text-center">
                  <p className="text-zinc-500 text-sm">검색 결과가 없습니다.</p>
                  <p className="text-zinc-600 text-xs mt-1">다른 키워드로 검색해보세요.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

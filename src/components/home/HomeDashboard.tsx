"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Heart, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Star, 
  Camera, 
  CheckCircle2, 
  XCircle,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { COMMUNITY_POSTS, QC_POSTS, CommunityPost } from "@/lib/data";

// 3열: 실시간 인기 TOP 5 데이터
const POPULAR_WATCHES = [
  { rank: 1, name: "데이토나 126500", factory: "Clean Factory", price: "₩780", image: "/hero_watch_3.png" },
  { rank: 2, name: "서브마리너 126610LN", factory: "VSF Factory", price: "₩530", image: "/hero_pc_1.png" },
  { rank: 3, name: "GMT-Master II 126710", factory: "Clean Factory", price: "₩650", image: "/hero_mobile_1.png" },
  { rank: 4, name: "데이트저스트 126334", factory: "VSF Factory", price: "₩420", image: "/hero_pc_3.png" },
  { rank: 5, name: "익스플로러 II 216570", factory: "Clean Factory", price: "₩480", image: "/hero_mobile_2.png" },
];

const POPULAR_BAGS = [
  { rank: 1, name: "클래식 플랩 백", factory: "Chanel 187", price: "₩630", image: "/hero_mobile_1.png" },
  { rank: 2, name: "타임리스 토트 백", factory: "Chanel 187", price: "₩580", image: "/hero_mobile_3.png" },
  { rank: 3, name: "스피디 25 모노그램", factory: "LV Factory", price: "₩350", image: "/hero_bag_2.png" },
  { rank: 4, name: "마몽 숄더 백", factory: "Gucci Factory", price: "₩320", image: "/hero_pc_1.png" },
  { rank: 5, name: "카세트 백", factory: "Bottega Factory", price: "₩410", image: "/hero_pc_3.png" },
];

const categoryColors: Record<string, string> = {
  "정보": "bg-white/[0.03] text-zinc-400 border-white/[0.05]",
  "자유": "bg-white/[0.03] text-zinc-400 border-white/[0.05]",
  "초보 가이드": "bg-white/[0.03] text-zinc-400 border-white/[0.05]",
  "Q&A": "bg-white/[0.03] text-zinc-400 border-white/[0.05]"
};

export function HomeDashboard() {
  // 1열 커뮤니티 카테고리 필터
  const [commTab, setCommTab] = useState("전체");
  // 3열 인기 모델 카테고리 토글
  const [popularTab, setPopularTab] = useState("시계");

  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // 가로 스크롤 버튼 상태 및 참조
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    let loadedPosts = COMMUNITY_POSTS;
    const stored = localStorage.getItem("community_posts");
    if (stored) {
      try {
        loadedPosts = JSON.parse(stored);
      } catch (e) {
        loadedPosts = COMMUNITY_POSTS;
      }
    } else {
      localStorage.setItem("community_posts", JSON.stringify(COMMUNITY_POSTS));
    }
    setPosts(loadedPosts);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      const t = setTimeout(checkScroll, 100);
      window.addEventListener("resize", checkScroll);
      return () => {
        if (el) el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
        clearTimeout(t);
      };
    }
  }, [posts]);

  // 커뮤니티 필터링 로직
  const filteredCommPosts = posts.filter(post => {
    if (commTab === "전체") return true;
    return post.category === commTab;
  });

  const popularModels = popularTab === "시계" ? POPULAR_WATCHES : POPULAR_BAGS;

  return (
    <section className="grid lg:grid-cols-3 gap-5 mt-2 mb-8">
      
      {/* 1열: 실시간 커뮤니티 피드 */}
      <div className="bg-[#111111]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-white tracking-tight">
              <MessageSquare size={16} className="text-gold" />
              실시간 커뮤니티 피드
            </h3>
            <Link href="/community" className="text-[11px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors font-medium">
              더보기 <ChevronRight size={12} />
            </Link>
          </div>

          {/* 카테고리 필터 탭 with Slide Buttons */}
          <div className="relative mb-4 group/tabs shrink-0">
            {showLeftArrow && (
              <button
                type="button"
                onClick={() => {
                  tabsRef.current?.scrollBy({ left: -100, behavior: "smooth" });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/85 border border-white/10 flex items-center justify-center text-white hover:text-gold transition-colors shadow-lg cursor-pointer"
                aria-label="이전 카테고리"
              >
                <ChevronLeft size={12} />
              </button>
            )}

            <div 
              ref={tabsRef}
              className="flex flex-nowrap items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 scroll-smooth"
            >
              {["전체", "초보 가이드", "정보", "Q&A", "자유"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCommTab(tab)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-300 shrink-0 ${
                    commTab === tab
                      ? "bg-gold text-black border-transparent shadow-sm shadow-gold/10"
                      : "bg-white/[0.02] text-zinc-400 border-white/[0.03] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {showRightArrow && (
              <button
                type="button"
                onClick={() => {
                  tabsRef.current?.scrollBy({ left: 100, behavior: "smooth" });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/85 border border-white/10 flex items-center justify-center text-white hover:text-gold transition-colors shadow-lg cursor-pointer"
                aria-label="다음 카테고리"
              >
                <ChevronRight size={12} />
              </button>
            )}
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredCommPosts.slice(0, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/community/${post.id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors group cursor-pointer border border-transparent hover:border-white/[0.02] block"
                >
                  {post.hasImage && post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-14 h-14 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-white/[0.03] border border-white/[0.04] flex items-center justify-center shrink-0">
                      <MessageSquare size={16} className="text-zinc-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded tracking-wide ${categoryColors[post.category] || "bg-zinc-800 text-zinc-400"}`}>
                      {post.category}
                    </span>
                    <h4 className="text-[12px] font-black text-white group-hover:text-gold transition-colors truncate mt-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-[9px] text-zinc-500 font-bold">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                      <span className="ml-auto flex items-center gap-0.5 text-zinc-400">
                        <MessageSquare size={10} /> {post.comments}
                      </span>
                      <span className="flex items-center gap-0.5 text-zinc-400">
                        <Heart size={10} /> {post.likes}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </AnimatePresence>
            {filteredCommPosts.length === 0 && (
              <div className="text-center py-12 text-zinc-600 text-xs font-bold">
                등록된 게시글이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2열: 실시간 QC 피드 (QC 새글) */}
      <div className="bg-[#111111]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-white tracking-tight">
              <Camera size={16} className="text-gold" />
              실시간 QC 피드
            </h3>
            <Link href="/qc" className="text-[11px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors font-medium">
              더보기 <ChevronRight size={12} />
            </Link>
          </div>

          {/* 최신 메인 추천 QC 카드 */}
          {QC_POSTS.length > 0 && (
            <Link href={`/qc/${QC_POSTS[0].id}`} className="block relative rounded-xl overflow-hidden mb-4 border border-white/[0.06] group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
              <img
                src={QC_POSTS[0].images[0]}
                alt={QC_POSTS[0].title}
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  QC_POSTS[0].type === "GL" 
                    ? "bg-emerald-500 text-black" 
                    : QC_POSTS[0].type === "RL" 
                    ? "bg-red-500 text-white" 
                    : "bg-blue-500 text-white"
                }`}>
                  {QC_POSTS[0].type}
                </span>
                <span className="text-[9px] font-bold text-zinc-300 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {QC_POSTS[0].factory}
                </span>
              </div>
              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20">
                <h4 className="text-xs font-black text-white group-hover:text-gold transition-colors truncate">
                  {QC_POSTS[0].title}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[9px] text-zinc-400 font-bold">
                  <span>{QC_POSTS[0].model}</span>
                  <span className="flex items-center gap-1 text-gold">
                    <CheckCircle2 size={10} /> GL {QC_POSTS[0].glVotes}명 • <XCircle size={10} /> RL {QC_POSTS[0].rlVotes}명
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* 나머지 QC 목록 */}
          <div className="space-y-2.5">
            {QC_POSTS.slice(1, 4).map((post) => {
              const statusStyle = 
                post.type === "GL" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : post.type === "RL" 
                  ? "bg-red-500/10 text-red-400 border-red-500/20" 
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20";
              
              const StatusIcon = 
                post.type === "GL" 
                  ? CheckCircle2 
                  : post.type === "RL" 
                  ? XCircle 
                  : HelpCircle;

              return (
                <Link
                  key={post.id}
                  href={`/qc/${post.id}`}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/[0.02] transition-colors group cursor-pointer border border-transparent hover:border-white/[0.02] block"
                >
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-10 h-10 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-black border px-1 rounded flex items-center gap-0.5 ${statusStyle}`}>
                        <StatusIcon size={8} /> {post.type}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-bold">
                        {post.factory}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-bold text-zinc-200 group-hover:text-gold transition-colors truncate mt-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[9px] text-zinc-500 font-bold">
                      <span>{post.time}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Eye size={10} /> {post.views}
                      </span>
                      <span className="ml-auto text-zinc-400 flex items-center gap-0.5">
                        GL {post.glVotes} • RL {post.rlVotes}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3열: 실시간 인기 TOP 5 */}
      <div className="bg-[#111111]/60 backdrop-blur-md border border-white/[0.05] rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-white tracking-tight">
              <Star size={16} className="text-gold" />
              실시간 인기 TOP 5
            </h3>
            <Link href="/prices" className="text-[11px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors font-medium">
              더보기 <ChevronRight size={12} />
            </Link>
          </div>

          {/* 시계/가방 분류 토글 */}
          <div className="grid grid-cols-2 gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.05] mb-4">
            {["시계", "가방"].map((tab) => (
              <button
                key={tab}
                onClick={() => setPopularTab(tab)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  popularTab === tab
                    ? "bg-gold text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 인기 모델 순위 목록 */}
          <div className="space-y-2.5">
            {popularModels.map((model) => {
              const badgeStyle = 
                model.rank === 1 
                  ? "bg-gradient-to-br from-[#FFD700] to-[#CC9900] text-black" 
                  : model.rank === 2 
                  ? "bg-gradient-to-br from-[#E0E0E0] to-[#9E9E9E] text-black" 
                  : model.rank === 3 
                  ? "bg-gradient-to-br from-[#CD7F32] to-[#8C5828] text-black" 
                  : "bg-white/[0.06] text-zinc-400 border border-white/[0.04]";
              
              return (
                <Link
                  key={model.rank}
                  href="/qc"
                  className="flex items-center gap-3 p-1.5 rounded-xl border border-transparent hover:border-white/[0.04] hover:bg-white/[0.02] transition-all group cursor-pointer block"
                >
                  {/* 순위 번호 뱃지 */}
                  <span className={`w-5 h-5 rounded ${badgeStyle} text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm`}>
                    {model.rank}
                  </span>

                  {/* 모델 썸네일 */}
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-10 h-10 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] shrink-0"
                  />

                  {/* 모델 정보 */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12px] font-black text-white group-hover:text-gold transition-colors truncate">
                      {model.name}
                    </h4>
                    <p className="text-[9px] text-zinc-500 font-bold truncate mt-0.5">
                      {model.factory}
                    </p>
                  </div>

                  {/* 가격 */}
                  <div className="text-right shrink-0">
                    <span className="text-[12px] font-black text-zinc-200">
                      {model.price}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

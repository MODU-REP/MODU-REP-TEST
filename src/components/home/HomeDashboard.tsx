"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Heart, 
  Eye, 
  ChevronRight, 
  Star, 
  Camera, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Flame,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { COMMUNITY_POSTS, QC_POSTS, CommunityPost } from "@/lib/data";

// 3열: 실시간 인기 TOP 5 데이터
const POPULAR_WATCHES = [
  { rank: 1, name: "데이토나 126500", factory: "Clean Factory", price: "₩780", image: "/hero_pc_2.png" },
  { rank: 2, name: "서브마리너 126610LN", factory: "VSF Factory", price: "₩530", image: "/hero_pc_1.png" },
  { rank: 3, name: "GMT-Master II 126710", factory: "Clean Factory", price: "₩650", image: "/hero_mobile_1.png" },
  { rank: 4, name: "데이트저스트 126334", factory: "VSF Factory", price: "₩420", image: "/hero_watch_3.png" },
  { rank: 5, name: "익스플로러 II 216570", factory: "Clean Factory", price: "₩480", image: "/hero_mobile_3.png" },
  { rank: 6, name: "GMT-Master II 펩시", factory: "Clean Factory", price: "₩670", image: "/hero_mobile_1.png" },
  { rank: 7, name: "씨드웰러 126600", factory: "VSF Factory", price: "₩560", image: "/hero_pc_1.png" },
  { rank: 8, name: "아쿠아테라 150M", factory: "VSF Factory", price: "₩410", image: "/hero_pc_3.png" },
];

const POPULAR_BAGS = [
  { rank: 1, name: "클래식 플랩 백", factory: "Chanel 187", price: "₩630", image: "/hero_bag_2.png" },
  { rank: 2, name: "타임리스 토트 백", factory: "Chanel 187", price: "₩580", image: "/hero_mobile_2.png" },
  { rank: 3, name: "스피디 25 모노그램", factory: "LV Factory", price: "₩350", image: "/hero_bag_2.png" },
  { rank: 4, name: "마몽 숄더 백", factory: "Gucci Factory", price: "₩320", image: "/hero_mobile_2.png" },
  { rank: 5, name: "카세트 백", factory: "Bottega Factory", price: "₩410", image: "/hero_bag_2.png" },
  { rank: 6, name: "가브리엘 백팩", factory: "Chanel 187", price: "₩540", image: "/hero_mobile_2.png" },
  { rank: 7, name: "샤넬 22백", factory: "Chanel 187", price: "₩490", image: "/hero_bag_2.png" },
  { rank: 8, name: "카바스 백", factory: "Celine Factory", price: "₩380", image: "/hero_bag_2.png" },
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

  // 커뮤니티 필터링 로직
  const filteredCommPosts = posts.filter(post => {
    if (commTab === "전체") return true;
    return post.category === commTab;
  });

  const popularModels = popularTab === "시계" ? POPULAR_WATCHES : POPULAR_BAGS;

  return (
    <section className="grid lg:grid-cols-3 gap-5 mt-2 mb-8 w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0">
      
      {/* 1열: 실시간 커뮤니티 피드 */}
      <div className="bg-[#111111]/60 backdrop-blur-md border-x-0 border-y sm:border border-white/[0.05] rounded-none sm:rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-white tracking-tight">
              <MessageSquare size={16} className="text-gold" />
              커뮤니티 새글
            </h3>
            <Link href="/community" className="text-[11px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors font-medium">
              더보기 <ChevronRight size={12} />
            </Link>
          </div>

          {/* 카테고리 필터 탭 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {["전체", "초보 가이드", "정보", "Q&A", "자유"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCommTab(tab)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-300 ${
                  commTab === tab
                    ? "bg-gold text-black border-transparent shadow-sm shadow-gold/10"
                    : "bg-white/[0.02] text-zinc-400 border-white/[0.03] hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 게시글 목록 (게시판 게시판 형태로 썸네일 없이 테이블 스타일 렌더링) */}
          <div className="overflow-hidden border border-white/[0.05] rounded-xl bg-black/20 mt-2">
            <table className="w-full border-collapse text-left text-[11px] font-bold">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3 text-center w-10">번호</th>
                  <th className="py-2.5 px-3">제목</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-[11px]">
                {filteredCommPosts.slice(0, 8).map((post, idx) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* 번호 */}
                    <td className="py-2.5 px-3 text-center text-zinc-500 font-medium w-10">
                      {idx + 1}
                    </td>
                    {/* 제목 */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/[0.03] ${categoryColors[post.category] || "bg-zinc-800 text-zinc-400"}`}>
                          {post.category}
                        </span>
                        {post.hot && <Flame size={10} className="text-orange-400 shrink-0" />}
                        <Link 
                          href={`/community/${post.id}`} 
                          className="text-zinc-300 group-hover:text-gold font-bold transition-colors truncate max-w-[150px] xs:max-w-[200px] md:max-w-[240px]"
                        >
                          {post.title}
                        </Link>
                        {post.comments > 0 && (
                          <span className="text-[9px] text-red-400 font-black shrink-0">
                            [{post.comments}]
                          </span>
                        )}
                        {post.hasImage && (
                          <ImageIcon size={10} className="text-zinc-500 shrink-0" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCommPosts.length === 0 && (
              <div className="text-center py-10 text-zinc-600 text-xs font-bold">
                등록된 게시글이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2열: 실시간 QC 피드 (QC 새글) */}
      <div className="bg-[#111111]/60 backdrop-blur-md border-x-0 border-y sm:border border-white/[0.05] rounded-none sm:rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-white tracking-tight">
              <Camera size={16} className="text-gold" />
              QC 새글
            </h3>
            <Link href="/qc" className="text-[11px] text-zinc-500 hover:text-gold flex items-center gap-0.5 transition-colors font-medium">
              더보기 <ChevronRight size={12} />
            </Link>
          </div>

          {/* QC 새글 리스트 (상단 카드 없이 썸네일 목록으로 꽉채움) */}
          <div className="space-y-3 mt-2">
            <AnimatePresence mode="popLayout">
              {QC_POSTS.slice(0, 6).map((post) => {
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
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors group cursor-pointer border border-transparent hover:border-white/[0.02]"
                  >
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-white/[0.06] shrink-0"
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
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3열: 실시간 인기 TOP 5 */}
      <div className="bg-[#111111]/60 backdrop-blur-md border-x-0 border-y sm:border border-white/[0.05] rounded-none sm:rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-[15px] font-bold text-white tracking-tight">
              <Star size={16} className="text-gold" />
              실시간 인기모델
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
                  className="flex items-center gap-3 p-1.5 rounded-xl border border-transparent hover:border-white/[0.04] hover:bg-white/[0.02] transition-all group cursor-pointer"
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

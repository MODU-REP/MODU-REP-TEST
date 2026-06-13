"use client";

import { motion } from "framer-motion";
import { User, Settings, Bell, Bookmark, MessageSquare, Eye, Camera, FileText, LogOut, ChevronRight, Star, Shield } from "lucide-react";
import Link from "next/link";

const MY_STATS = [
  { label: "작성글", value: 24, icon: FileText },
  { label: "QC 요청", value: 12, icon: Camera },
  { label: "댓글", value: 87, icon: MessageSquare },
  { label: "북마크", value: 35, icon: Bookmark },
];

const MY_POSTS = [
  { id: 1, title: "VSF 서브 3일차 QC 도착, 봐주세요", category: "QC", views: 512, comments: 24, time: "2분 전" },
  { id: 2, title: "Clean Daytona 한달 사용기 솔직 후기", category: "후기", views: 845, comments: 31, time: "3일 전" },
  { id: 3, title: "첫 구매인데 어떤 공장이 좋을까요?", category: "자유", views: 367, comments: 15, time: "1주 전" },
  { id: 4, title: "ZF AP 블루 다이얼 색감 확인 부탁", category: "QC", views: 189, comments: 7, time: "2주 전" },
];

const MENU_ITEMS = [
  { label: "내 게시글", href: "/mypage/posts", icon: FileText },
  { label: "내 QC", href: "/mypage/qc", icon: Camera },
  { label: "북마크", href: "/mypage/bookmarks", icon: Bookmark },
  { label: "알림 설정", href: "/mypage/notifications", icon: Bell },
  { label: "계정 설정", href: "/mypage/settings", icon: Settings },
  { label: "보안", href: "/mypage/security", icon: Shield },
];

export default function MyPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[800px] mx-auto px-3 sm:px-4 py-6">
        {/* Profile Card */}
        <div className="glass rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-black shrink-0">
              <User size={28} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">워치매니아</h2>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gold/20 text-gold">Lv.5</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">가입일: 2024.01.15 · 활동 152일</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="text-yellow-400" fill="currentColor" />
                ))}
                <span className="text-[10px] text-zinc-400 ml-1">신뢰도 4.9</span>
              </div>
            </div>
            <Link href="/mypage/settings" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Settings size={18} className="text-zinc-400" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {MY_STATS.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-3 text-center"
            >
              <Icon size={16} className="text-gold mx-auto mb-1.5" />
              <p className="text-lg font-bold">{value}</p>
              <p className="text-[10px] text-zinc-500">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Menu */}
        <div className="glass rounded-xl divide-y divide-white/[0.04] mb-6">
          {MENU_ITEMS.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-zinc-400 group-hover:text-gold transition-colors" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <ChevronRight size={14} className="text-zinc-600 group-hover:text-gold transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent Posts */}
        <div>
          <h3 className="text-sm font-black text-white mb-3 uppercase tracking-wider">최근 작성글</h3>
          <div className="glass rounded-xl divide-y divide-white/[0.04]">
            {MY_POSTS.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors group">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 shrink-0">{post.category}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate group-hover:text-gold transition-colors">{post.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                    <span className="flex items-center gap-0.5"><Eye size={9} />{post.views}</span>
                    <span className="flex items-center gap-0.5"><MessageSquare size={9} />{post.comments}</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button className="flex items-center gap-2 mt-6 px-4 py-2.5 text-sm text-zinc-500 hover:text-red-400 transition-colors">
          <LogOut size={14} /> 로그아웃
        </button>
      </div>
    </div>
  );
}

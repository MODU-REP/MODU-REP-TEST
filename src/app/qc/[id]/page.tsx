"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MessageSquare,
  ThumbsUp,
  Sliders,
  Send,
  HelpCircle
} from "lucide-react";
import { QC_POSTS, QCComment } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QCDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const qcId = parseInt(resolvedParams.id);

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 이미지 슬라이더 인덱스
  const [activeImg, setActiveImg] = useState(0);

  // 투표 및 댓글 로컬 상태 관리
  const [glVotes, setGlVotes] = useState(0);
  const [rlVotes, setRlVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState<"GL" | "RL" | null>(null);

  const [comments, setComments] = useState<QCComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [verdict, setVerdict] = useState<"GL" | "RL" | "COMMENT">("GL");

  useEffect(() => {
    let loadedPosts = QC_POSTS;
    const stored = localStorage.getItem("qc_posts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        loadedPosts = [...parsed, ...QC_POSTS];
      } catch (e) {}
    }
    const found = loadedPosts.find((q) => q.id === qcId);
    if (found) {
      setPost(found);
      setGlVotes(found.glVotes);
      setRlVotes(found.rlVotes);
      setComments(found.comments || []);
    }
    setLoading(false);
  }, [qcId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black">
        <p className="text-zinc-500 font-bold text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black">
        <p className="text-zinc-500 font-bold text-sm">해당 QC 자료를 찾을 수 없습니다.</p>
        <Link href="/qc" className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 text-white transition-colors">
          QC 갤러리로 돌아가기
        </Link>
      </div>
    );
  }

  const handleVote = (type: "GL" | "RL") => {
    if (hasVoted === type) {
      // 투표 취소
      if (type === "GL") setGlVotes(glVotes - 1);
      else setRlVotes(rlVotes - 1);
      setHasVoted(null);
    } else {
      // 투표 전환 또는 신규
      if (hasVoted === "GL") {
        setGlVotes(glVotes - 1);
        setRlVotes(rlVotes + 1);
      } else if (hasVoted === "RL") {
        setRlVotes(rlVotes - 1);
        setGlVotes(glVotes + 1);
      } else {
        if (type === "GL") setGlVotes(glVotes + 1);
        else setRlVotes(rlVotes + 1);
      }
      setHasVoted(type);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: QCComment = {
      id: Date.now(),
      author: "나(렙마스터)",
      avatar: "나",
      type: verdict,
      text: newComment,
      time: "방금 전"
    };

    // 댓글을 달 때 자동으로 투표수에도 반영되게 함
    if (verdict === "GL") setGlVotes(glVotes + 1);
    if (verdict === "RL") setRlVotes(rlVotes + 1);

    setComments([...comments, added]);
    setNewComment("");
  };

  const totalVotes = glVotes + rlVotes;
  const glPercent = totalVotes > 0 ? Math.round((glVotes / totalVotes) * 100) : 50;
  const rlPercent = totalVotes > 0 ? 100 - glPercent : 50;

  return (
    <div className="min-h-screen bg-black pb-20 py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Back Link */}
        <div className="mb-4">
          <Link href="/qc" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-gold transition-colors">
            <ArrowLeft size={14} /> QC 갤러리로 돌아가기
          </Link>
        </div>

        {/* Title Block */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border ${
                post.type === "GL" 
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" 
                  : post.type === "RL" 
                  ? "bg-red-500/20 text-red-400 border-red-500/20" 
                  : "bg-blue-500/20 text-blue-400 border-blue-500/20"
              }`}>
                {post.type} 판정
              </span>
              <span className="text-[10px] text-zinc-500 font-bold">
                {post.factory} • {post.category}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {post.title}
            </h1>
            <p className="text-[11px] text-zinc-500 mt-1 font-bold">
              작성자 {post.author} • 등록 {post.time} • 조회 {post.views}
            </p>
          </div>
          <div className="text-right sm:text-right shrink-0">
            <span className="text-[10px] font-bold text-zinc-500 block">TD 출고가</span>
            <span className="text-xl font-black text-gold">{post.price}</span>
          </div>
        </div>

        {/* 2-Column layout: Left Image, Right Specs & Votes */}
        <div className="grid lg:grid-cols-[1fr_450px] gap-6 mb-6">
          
          {/* Left Column: Image Slider */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] bg-zinc-950 flex items-center justify-center group">
              <img 
                src={post.images[activeImg]} 
                alt="QC 확대 이미지" 
                className="w-full h-full object-contain"
              />
              
              {/* Prev/Next buttons */}
              {post.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImg((activeImg - 1 + post.images.length) % post.images.length)}
                    className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-gold hover:text-black border border-white/10 text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImg((activeImg + 1) % post.images.length)}
                    className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-gold hover:text-black border border-white/10 text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
                    aria-label="다음 이미지"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Index indicator */}
              <span className="absolute bottom-4 right-4 text-[10px] font-bold px-2 py-1 rounded-full bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-sm">
                {activeImg + 1} / {post.images.length}
              </span>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-1">
              {post.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    activeImg === i 
                      ? "border-gold scale-95 shadow-lg shadow-gold/15" 
                      : "border-white/[0.06] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specs Table & Voting */}
          <div className="space-y-6">
            
            {/* 🗳️ Live Community GL/RL Voting Counter */}
            <div className="glass rounded-2xl p-5 border border-gold/15 bg-gold/[0.02] shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                <Sliders size={14} className="text-gold" />
                실시간 커뮤니티 판독 현황
              </h3>

              {/* Progress bar */}
              <div className="h-3 rounded-full bg-zinc-800 border border-white/[0.04] overflow-hidden flex mb-4">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${glPercent}%` }} 
                />
                <div 
                  className="bg-red-500 h-full transition-all duration-500" 
                  style={{ width: `${rlPercent}%` }} 
                />
              </div>

              {/* Percentages and votes count */}
              <div className="grid grid-cols-2 text-center text-xs font-bold mb-5">
                <div className="border-r border-white/[0.05]">
                  <span className="text-emerald-400 block text-lg font-black">{glPercent}%</span>
                  <span className="text-[10px] text-zinc-500">GL (합격 의견) {glVotes}명</span>
                </div>
                <div>
                  <span className="text-red-400 block text-lg font-black">{rlPercent}%</span>
                  <span className="text-[10px] text-zinc-500">RL (재요청 의견) {rlVotes}명</span>
                </div>
              </div>

              {/* Interactive vote buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleVote("GL")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-black transition-all ${
                    hasVoted === "GL" 
                      ? "bg-emerald-500 text-black border-transparent shadow-lg shadow-emerald-500/10" 
                      : "bg-white/[0.02] text-zinc-400 border-white/[0.05] hover:text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/20"
                  }`}
                >
                  <CheckCircle2 size={14} /> GL 투표하기
                </button>
                <button 
                  onClick={() => handleVote("RL")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-black transition-all ${
                    hasVoted === "RL" 
                      ? "bg-red-500 text-white border-transparent shadow-lg shadow-red-500/10" 
                      : "bg-white/[0.02] text-zinc-400 border-white/[0.05] hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20"
                  }`}
                >
                  <XCircle size={14} /> RL 투표하기
                </button>
              </div>
            </div>

            {/* 📝 Inspection Specifications */}
            <div className="glass rounded-2xl p-5 border border-white/[0.05] bg-[#111111]/30">
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4">
                페이크포인트 검사 정보
              </h3>
              
              <div className="divide-y divide-white/[0.04] text-xs">
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-zinc-500 shrink-0 font-bold">다이얼 &amp; 핸즈</span>
                  <span className="text-zinc-300 font-semibold text-right">{post.specs.dial}</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-zinc-500 shrink-0 font-bold">베젤 &amp; 인서트</span>
                  <span className="text-zinc-300 font-semibold text-right">{post.specs.bezel}</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-zinc-500 shrink-0 font-bold">레하우 각인</span>
                  <span className="text-zinc-300 font-semibold text-right">{post.specs.rehaut}</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-zinc-500 shrink-0 font-bold">날짜창 (DW)</span>
                  <span className="text-zinc-300 font-semibold text-right">{post.specs.datewheel}</span>
                </div>
                <div className="py-2.5 flex items-start justify-between gap-4">
                  <span className="text-zinc-500 shrink-0 font-bold">버클 &amp; 글라스</span>
                  <span className="text-zinc-300 font-semibold text-right">{post.specs.clasp}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Comments Section */}
        <div className="glass rounded-2xl p-6 border border-white/[0.05] bg-[#111111]/20">
          <h3 className="text-sm font-black text-white mb-6 flex items-center gap-2">
            <MessageSquare size={16} className="text-gold" />
            판독 코멘트 {comments.length}개
          </h3>

          {/* Comment list */}
          <div className="space-y-4 mb-6">
            {comments.map((comment) => {
              const labelStyle = 
                comment.type === "GL" 
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10" 
                  : comment.type === "RL" 
                  ? "bg-red-500/15 text-red-400 border border-red-500/10" 
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700/20";
              
              return (
                <div key={comment.id} className="flex items-start gap-3 text-xs border-b border-white/[0.03] pb-4 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/[0.05] flex items-center justify-center font-black text-gold shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-bold text-zinc-500 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-300">{comment.author}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.25 rounded ${labelStyle}`}>
                          {comment.type}
                        </span>
                      </div>
                      <span>{comment.time}</span>
                    </div>
                    <p className="text-zinc-300 font-medium leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verdict appraisal submit form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] pb-3 mb-2">
              <span className="text-[10px] text-zinc-500 font-black uppercase">판정 선택</span>
              
              {/* GL / RL / COMMENT Tag Selector */}
              <div className="flex gap-1.5">
                {(["GL", "RL", "COMMENT"] as const).map((tag) => {
                  const active = verdict === tag;
                  const activeStyle = 
                    tag === "GL" 
                      ? "bg-emerald-500 text-black font-black" 
                      : tag === "RL" 
                      ? "bg-red-500 text-white font-black" 
                      : "bg-zinc-600 text-white font-black";
                  
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setVerdict(tag)}
                      className={`px-3 py-1 rounded text-[9px] font-bold border transition-all ${
                        active 
                          ? activeStyle 
                          : "bg-white/[0.02] text-zinc-500 border-white/[0.04] hover:text-white"
                      }`}
                    >
                      {tag === "GL" ? "GL (합격)" : tag === "RL" ? "RL (불합격)" : "일반 의견"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl p-2 focus-within:border-gold/30 transition-colors">
              <input 
                type="text" 
                placeholder="상세 판독 의견을 작성하세요..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none px-2 py-1 font-bold"
              />
              <button 
                type="submit"
                className="p-2 bg-gold hover:bg-gold-light text-black rounded-lg transition-colors shrink-0"
                aria-label="의견 제출"
              >
                <Send size={12} />
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

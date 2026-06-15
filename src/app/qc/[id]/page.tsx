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
  HelpCircle,
  X,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QC_POSTS, QCComment } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QCDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const qcId = parseInt(resolvedParams.id);

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 이미지 슬라이더 및 라이트박스 상태
  const [activeImg, setActiveImg] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // 터치 및 줌/드래그 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // 라이트박스 줌/팬 상태
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);

  const handleTouchStartMain = (e: React.TouchEvent) => {
    setIsSwiping(false);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMoveMain = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    if (touchStart && Math.abs(touchStart - currentX) > 10) {
      setIsSwiping(true);
    }
    setTouchEnd(currentX);
  };

  const handleTouchEndMain = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setActiveImg((activeImg + 1) % post.images.length);
    } else if (isRightSwipe) {
      setActiveImg((activeImg - 1 + post.images.length) % post.images.length);
    }
  };

  const handleDoubleTap = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleTouchStartLightbox = (e: React.TouchEvent) => {
    setIsSwiping(false);
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);

    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchStartDist(dist);
    } else if (e.touches.length === 1 && scale > 1) {
      setPanStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
      setIsPanning(true);
    }
  };

  const handleTouchMoveLightbox = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.max(1, Math.min(3, dist / pinchStartDist));
      setScale(newScale);
    } else if (e.touches.length === 1) {
      const currentX = e.touches[0].clientX;
      if (touchStart && Math.abs(touchStart - currentX) > 10) {
        setIsSwiping(true);
      }
      setTouchEnd(currentX);

      if (scale > 1 && isPanning) {
        const newX = e.touches[0].clientX - panStart.x;
        const newY = e.touches[0].clientY - panStart.y;
        const limitX = (scale - 1) * 150;
        const limitY = (scale - 1) * 150;
        setPosition({
          x: Math.max(-limitX, Math.min(limitX, newX)),
          y: Math.max(-limitY, Math.min(limitY, newY))
        });
      }
    }
  };

  const handleTouchEndLightbox = () => {
    setPinchStartDist(null);
    setIsPanning(false);

    if (scale <= 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      if (touchStart && touchEnd) {
        const distance = touchStart - touchEnd;
        if (distance > 50) {
          setActiveImg((activeImg + 1) % post.images.length);
        } else if (distance < -50) {
          setActiveImg((activeImg - 1 + post.images.length) % post.images.length);
        }
      }
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      handleDoubleTap();
    }
    setLastTap(now);
  };

  const handleLightboxClose = () => {
    setIsLightboxOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

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

  // 판매처 / 가격 라벨링 분기
  const isNumericPrice = post.price && (
    post.price.includes("₩") || 
    post.price.includes("원") || 
    /^\d/.test(post.price.replace(/[\s,]/g, ''))
  );
  const priceLabel = isNumericPrice ? "TD 출고가" : "판매처";

  // 카테고리별 궁금한 점/검수 항목 파싱
  const isWatch = post.category === "시계";
  const concernsMapping = isWatch 
    ? [
        { name: "인덱스", key: "rehaut", defaultDesc: "12시 방향 로고가 반듯한지, 각 시간 표시 막대기(아워 마커)들이 삐뚤어지지 않고 수평이 맞는지 확인합니다." },
        { name: "베젤", key: "bezel", defaultDesc: "시계 테두리 회전링의 눈금들이 안쪽 문자판 눈금과 일치하는지, 12시 방향의 동그란 야광점이 정중앙에 잘 맞는지 확인합니다." },
        { name: "날짜창", key: "datewheel", defaultDesc: "날짜 숫자가 위/아래/좌/우 한쪽으로 치우쳐 쏠려 있지 않은지, 글자 번짐 없이 깔끔하게 인쇄되었는지 확인합니다." },
        { name: "다이얼", key: "dial", defaultDesc: "문자판 안의 브랜드 로고 글씨 인쇄가 선명한지, 시침/분침 바늘이 정렬되어 있는지, 야광 도료가 골고루 예쁘게 칠해졌는지 확인합니다." },
        { name: "전체 검수", key: "clasp", defaultDesc: "시계 앞면 유리 단차, 시계줄과 본체 사이의 연결 틈새가 너무 벌어지지 않았는지, 버클이 부드럽게 잘 잠기고 열리는지 확인합니다." },
      ]
    : [
        { name: "로고/박임", key: "dial", defaultDesc: "브랜드 글자 로고가 삐뚤지 않고 반듯한지, 금박·은박 인쇄가 흐릿하거나 번지지 않고 선명하게 찍혔는지 확인합니다." },
        { name: "스티칭/대칭", key: "rehaut", defaultDesc: "다이아몬드 가죽 패턴(퀼팅) 라인이 대칭으로 잘 맞아떨어지는지, 바느질(박음질) 줄이 일정하고 깔끔한지 확인합니다." },
        { name: "가죽 질감", key: "bezel", defaultDesc: "가죽 고유의 부드러운 광택과 오돌토돌한 질감(엠보싱)이 자연스러운지, 가죽 표면에 이상한 찌그러짐은 없는지 확인합니다." },
        { name: "하드웨어/도금", key: "datewheel", defaultDesc: "체인이나 금속 버클의 금빛/은빛 색상이 너무 가짜 같지 않은지, 금속 부위에 눈에 띄는 큰 스크래치(흠집)는 없는지 확인합니다." },
        { name: "전체 검수", key: "clasp", defaultDesc: "가방을 정면에서 똑바로 보았을 때 좌우 모양 균형이 맞는지, 가방 덮개가 삐뚤어지지 않고 똑바로 잘 닫히는지 확인합니다." },
      ];

  const parsedConcerns = concernsMapping.map((concern) => {
    const value = post.specs?.[concern.key] || "";
    
    // 1. 새 글쓰기 폼에서 넘어온 "검수 요청" 항목
    if (value.includes("[검수 요청]")) {
      const regex = /⚠️?\s*\[검수\s*요청\]\s*(.*?)(?:\s*\((.*?)\))?$/;
      const match = value.match(regex);
      const memo = match ? match[2] || "" : "";
      
      return {
        name: concern.name,
        status: "request",
        text: concern.defaultDesc, // 항상 최신 가이드라인 문구를 사용
        memo: memo
      };
    }
    
    // 2. 새 글쓰기 폼에서 미선택된 항목
    if (value === "양호 (정상 범위)") {
      return {
        name: concern.name,
        status: "ok",
        text: "양호 (특이사항 없음)"
      };
    }
    
    // 3. 기존의 하드코딩된 상세 데이터 (하위 호환성 유지)
    if (value && value.trim()) {
      return {
        name: concern.name,
        status: "detail",
        text: value
      };
    }
    
    // 4. 기본 폴백
    return {
      name: concern.name,
      status: "ok",
      text: "양호 (특이사항 없음)"
    };
  });

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
                {post.type === "QC" ? "QC 투표 대기" : post.type === "GL" ? "GL 합격" : "RL 재요청"}
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
            <span className="text-[10px] font-bold text-zinc-500 block">{priceLabel}</span>
            <span className="text-xl font-black text-gold">{post.price}</span>
          </div>
        </div>

        {/* 2-Column layout: Left Image, Right Specs & Votes */}
        <div className="grid lg:grid-cols-[1fr_450px] gap-6 mb-6">
          
          {/* Left Column: Image Slider */}
          <div className="space-y-4">
            <div 
              onTouchStart={handleTouchStartMain}
              onTouchMove={handleTouchMoveMain}
              onTouchEnd={handleTouchEndMain}
              onClick={(e) => {
                if (isSwiping) {
                  e.preventDefault();
                  return;
                }
                setIsLightboxOpen(true);
              }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] bg-zinc-950 flex items-center justify-center group cursor-pointer"
            >
              <img 
                src={post.images[activeImg]} 
                alt="QC 확대 이미지" 
                className="w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
              
              {/* Prev/Next buttons */}
              {post.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg((activeImg - 1 + post.images.length) % post.images.length);
                    }}
                    className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-gold hover:text-black border border-white/10 text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 z-10"
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImg((activeImg + 1) % post.images.length);
                    }}
                    className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-gold hover:text-black border border-white/10 text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 z-10"
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
                실시간 커뮤니티 투표 현황
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

            {/* 📋 궁금한 점 & 검수 항목 */}
            <div className="glass rounded-2xl p-5 border border-white/[0.05] bg-[#111111]/30">
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                <Sliders size={14} className="text-gold" />
                궁금한 점 & 검수 항목
              </h3>
              
              <div className="space-y-3">
                {parsedConcerns.map((item, idx) => {
                  const isRequest = item.status === "request";
                  const isDetail = item.status === "detail";
                  
                  return (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isRequest 
                          ? "border-gold/30 bg-gold/[0.03]" 
                          : isDetail
                          ? "border-white/[0.08] bg-white/[0.01]"
                          : "border-white/[0.04] bg-white/[0.005] opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            isRequest 
                              ? "border-gold bg-gold text-black" 
                              : isDetail
                              ? "border-zinc-500 bg-zinc-800 text-zinc-300"
                              : "border-zinc-800 text-zinc-700"
                          }`}>
                            {(isRequest || isDetail) && <Check size={10} strokeWidth={3} />}
                          </div>
                          <span className={`text-[11px] font-black ${
                            isRequest ? "text-gold" : "text-zinc-200"
                          }`}>
                            {item.name}
                          </span>
                        </div>
                        
                        {isRequest && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/15">
                            검수 요청
                          </span>
                        )}
                        {isDetail && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/30">
                            상세 분석
                          </span>
                        )}
                        {!isRequest && !isDetail && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900/50 text-zinc-600 border border-white/[0.02]">
                            양호
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-[11px] leading-relaxed font-bold ${
                        isRequest 
                          ? "text-zinc-300" 
                          : isDetail 
                          ? "text-zinc-300" 
                          : "text-zinc-500"
                      }`}>
                        {item.text}
                      </p>
                      
                      {isRequest && item.memo && (
                        <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/[0.04] text-[10px] text-zinc-400 leading-normal font-medium">
                          <span className="text-gold font-bold mr-1">요청 메모:</span>
                          {item.memo}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Comments Section */}
        <div className="glass rounded-2xl p-6 border border-white/[0.05] bg-[#111111]/20">
          <h3 className="text-sm font-black text-white mb-6 flex items-center gap-2">
            <MessageSquare size={16} className="text-gold" />
            투표 코멘트 {comments.length}개
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
              <span className="text-[10px] text-zinc-500 font-black uppercase">투표 선택</span>
              
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
                placeholder="상세 투표 의견을 작성하세요..." 
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-between p-4"
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between z-10 text-white">
              <span className="text-xs font-bold text-zinc-400">
                {activeImg + 1} / {post.images.length}
              </span>
              <button 
                onClick={handleLightboxClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Image Container */}
            <div 
              className="flex-1 w-full flex items-center justify-center overflow-hidden relative"
              onTouchStart={handleTouchStartLightbox}
              onTouchMove={handleTouchMoveLightbox}
              onTouchEnd={handleTouchEndLightbox}
            >
              <div
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transition: isPanning ? "none" : "transform 0.15s ease-out"
                }}
                className="max-w-full max-h-[75vh] md:max-h-[85vh] select-none cursor-grab active:cursor-grabbing"
                onClick={handleImageClick}
              >
                <img
                  src={post.images[activeImg]}
                  alt="QC 라이트박스 이미지"
                  className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Prev/Next buttons for desktop inside Lightbox */}
              {post.images.length > 1 && scale === 1 && (
                <>
                  <button 
                    onClick={() => setActiveImg((activeImg - 1 + post.images.length) % post.images.length)}
                    className="hidden md:flex absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md cursor-pointer"
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImg((activeImg + 1) % post.images.length)}
                    className="hidden md:flex absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all backdrop-blur-md cursor-pointer"
                    aria-label="다음 이미지"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Info Bar / Zoom Info */}
            <div className="w-full text-center pb-4 z-10 text-[11px] text-zinc-500 font-bold">
              {scale > 1 ? (
                <span>손가락으로 드래그하여 이동할 수 있습니다. 더블 탭하면 원래 크기대로 축소됩니다.</span>
              ) : (
                <span>손가락으로 쓸어서 넘기거나, 이미지를 더블 클릭/더블 탭하여 확대하세요.</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

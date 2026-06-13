"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ThumbsUp, Eye, Send, User } from "lucide-react";
import { COMMUNITY_POSTS, CommunityPost } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

const DEFAULT_COMMENTS: Record<number, Comment[]> = {
  1: [
    { id: 1, author: "로렉골드", avatar: "로", text: "상세한 비교 감사드립니다! 역시 무브먼트 질감은 VSF를 따라갈 수가 없군요. 저도 이번엔 VSF로 한 개 달려보려 합니다.", time: "8분 전" },
    { id: 2, author: "페이크포인트", avatar: "페", text: "클린 섭마 쓰고 있는데 외관 인서트 퀄리티는 진짜 볼 때마다 지립니다. 정품 찰 필요가 없어요 진짜...", time: "5분 전" },
    { id: 3, author: "무브러버", avatar: "무", text: "VSF 3235 무브 진짜 부드럽습니다. 밥 주는 느낌이 정품이랑 거의 95% 일치해요.", time: "2분 전" }
  ],
  2: [
    { id: 1, author: "엘레강스", avatar: "엘", text: "187공장 가죽 진짜 쫀득쫀득하고 좋아요. 다른 공장 싸구려 캐비어는 딱딱해서 만지는 순간 필드컷 나는데 187은 대단함.", time: "1시간 전" },
    { id: 2, author: "샤넬마스터", avatar: "샤", text: "저도 강남 신세계 샤넬 매장 들고 가봤는데 아무 말도 안 하더군요 ㅋㅋ 187 킹배치 무조건 강추입니다.", time: "30분 전" }
  ],
  5: [
    { id: 1, author: "레린이1호", avatar: "레", text: "와 진짜 입문자용 바이블이네요. 하나하나 다 읽어봤는데 너무 유용합니다. 즐겨찾기 박고 갑니다!", time: "12시간 전" },
    { id: 2, author: "공장수집가", avatar: "공", text: "AF 탱크 머스트 쿼츠 버전 진짜 명작입니다. 정품이랑 무브 스위스 론다 똑같이 들어가서 뒷백 안 까보면 진짜 모름.", time: "10시간 전" }
  ]
};

export default function CommunityPostDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const postId = parseInt(resolvedParams.id);

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. localStorage에서 posts 읽기
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

    // 2. 해당 postId 포스트 찾기
    const foundPost = loadedPosts.find((p) => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
      setLikes(foundPost.likes);
    }
    
    // 3. 댓글 설정
    const defaultComments = DEFAULT_COMMENTS[postId] || [
      { id: 1, author: "익명매니아", avatar: "익", text: "글 잘 읽었습니다! 좋은 정보 정말 감사합니다.", time: "1시간 전" },
      { id: 2, author: "렙러버", avatar: "렙", text: "공감되네요. 역시 대화 나눠보면 통하는 게 많습니다.", time: "30분 전" }
    ];
    setComments(defaultComments);
    setLoading(false);
  }, [postId]);

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
        <p className="text-zinc-500 font-bold text-sm">해당 게시글을 찾을 수 없습니다.</p>
        <Link href="/community" className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 text-white transition-colors">
          커뮤니티 목록으로 가기
        </Link>
      </div>
    );
  }

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const addedComment: Comment = {
      id: Date.now(),
      author: "나(렙마스터)",
      avatar: "나",
      text: newComment,
      time: "방금 전"
    };

    setComments([...comments, addedComment]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-[1000px] mx-auto px-4">
        
        {/* Back navigation */}
        <div className="mb-4">
          <Link href="/community" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-gold transition-colors">
            <ArrowLeft size={14} /> 커뮤니티 목록으로
          </Link>
        </div>

        {/* Main Post Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/[0.05] bg-[#111111]/30 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/15 tracking-wide uppercase">
              {post.category}
            </span>
            <span className="text-[10px] text-zinc-500 font-bold">
              {post.time}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white leading-snug mb-4 tracking-tight">
            {post.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-6 text-xs text-zinc-500 font-bold">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/[0.05] flex items-center justify-center text-xs font-black text-gold shrink-0">
                {post.avatar}
              </div>
              <div>
                <p className="text-zinc-300 font-black">{post.author}</p>
                <p className="text-[10px] text-zinc-500 font-bold">VIP 회원</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Eye size={13} /> {post.views}</span>
              <span className="flex items-center gap-1"><MessageSquare size={13} /> {comments.length}</span>
            </div>
          </div>

          {/* Post Content */}
          <div className="text-zinc-300 text-sm sm:text-[15px] leading-relaxed font-medium whitespace-pre-line mb-8 min-h-[150px]">
            {post.content}
            {post.hasImage && post.image && (
              <div className="mt-6 max-w-lg rounded-xl overflow-hidden border border-white/[0.06] bg-zinc-900">
                <img src={post.image} alt="본문 이미지" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>

          {/* Like/Recommend Button */}
          <div className="flex justify-center border-t border-white/[0.05] pt-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-300 font-bold text-xs sm:text-sm ${
                hasLiked 
                  ? "bg-gold text-black border-transparent shadow-lg shadow-gold/20" 
                  : "bg-white/[0.02] text-zinc-400 border-white/[0.05] hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <ThumbsUp size={16} fill={hasLiked ? "currentColor" : "none"} />
              추천 {likes}
            </button>
          </div>

        </div>

        {/* Comments Section */}
        <div className="glass rounded-2xl p-6 border border-white/[0.05] bg-[#111111]/20">
          <h3 className="text-sm font-black text-white mb-6 flex items-center gap-2">
            <MessageSquare size={16} className="text-gold" />
            댓글 {comments.length}개
          </h3>

          {/* Comment list */}
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 text-xs border-b border-white/[0.03] pb-4 last:border-b-0 last:pb-0">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/[0.05] flex items-center justify-center font-black text-gold shrink-0">
                  {comment.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between font-bold text-zinc-500 mb-1.5">
                    <span className="text-zinc-300">{comment.author}</span>
                    <span>{comment.time}</span>
                  </div>
                  <p className="text-zinc-300 font-medium leading-relaxed whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Write comment form */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-2 border border-white/[0.08] bg-white/[0.03] rounded-xl p-2 focus-within:border-gold/30 transition-colors">
            <input 
              type="text" 
              placeholder="댓글을 입력하세요..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none px-2 py-1 font-bold"
            />
            <button 
              type="submit"
              className="p-2 bg-gold hover:bg-gold-light text-black rounded-lg transition-colors shrink-0"
              aria-label="댓글 작성"
            >
              <Send size={12} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}

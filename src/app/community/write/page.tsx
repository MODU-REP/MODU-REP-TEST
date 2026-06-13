"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PenLine, Image as ImageIcon, Check } from "lucide-react";
import { COMMUNITY_POSTS, CommunityPost } from "@/lib/data";

const CATEGORIES = ["초보 가이드", "정보", "자유", "Q&A"] as const;

const PRESET_IMAGES = [
  { label: "선택 안함 (텍스트 전용)", value: "", preview: "" },
  { label: "롤렉스 서브마리너 126610LN", value: "/hero_pc_1.png", preview: "/hero_pc_1.png" },
  { label: "파텍필립 그랜드 컴플리케이션", value: "/hero_watch_3.png", preview: "/hero_watch_3.png" },
  { label: "샤넬 클래식 백 (가죽)", value: "/hero_bag_2.png", preview: "/hero_bag_2.png" },
  { label: "롤렉스 코스모그래프 데이토나", value: "/hero_pc_2.png", preview: "/hero_pc_2.png" },
  { label: "오메가 스피드마스터 문워치", value: "/hero_pc_3.png", preview: "/hero_pc_3.png" },
];

export default function CommunityWritePage() {
  const router = useRouter();
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("자유");
  const [author, setAuthor] = useState("렙마스터");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // 이미지 설정
  const [imageType, setImageType] = useState<"preset" | "url">("preset");
  const [presetImage, setPresetImage] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("내용을 입력해주세요.");
      return;
    }
    if (!author.trim()) {
      setErrorMessage("작성자명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. 기존 게시글 목록 로드
      let currentPosts: CommunityPost[] = [];
      const stored = localStorage.getItem("community_posts");
      if (stored) {
        try {
          currentPosts = JSON.parse(stored);
        } catch (err) {
          currentPosts = [...COMMUNITY_POSTS];
        }
      } else {
        currentPosts = [...COMMUNITY_POSTS];
      }

      // 2. 새 게시글 ID 설정 (가장 큰 ID + 1)
      const nextId = currentPosts.length > 0 
        ? Math.max(...currentPosts.map(p => p.id)) + 1 
        : 1;

      // 3. 이미지 주소 및 유무 결정
      const finalImage = imageType === "preset" ? presetImage : customImageUrl.trim();
      const hasImage = !!finalImage;

      // 4. 새 게시글 객체 생성
      const newPost: CommunityPost = {
        id: nextId,
        category,
        title: title.trim(),
        author: author.trim(),
        avatar: author.trim().charAt(0) || "익",
        comments: 0,
        views: 0,
        likes: 0,
        time: "방금 전",
        hot: false,
        hasImage,
        image: finalImage,
        content: content.trim()
      };

      // 5. 저장 및 리다이렉트 (가장 앞에 추가)
      const updatedPosts = [newPost, ...currentPosts];
      localStorage.setItem("community_posts", JSON.stringify(updatedPosts));

      router.push("/community");
    } catch (err) {
      console.error(err);
      setErrorMessage("글 저장 중에 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-[900px] mx-auto px-4">
        
        {/* 뒤로가기 */}
        <div className="mb-4">
          <Link href="/community" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-gold transition-colors">
            <ArrowLeft size={14} /> 커뮤니티로 돌아가기
          </Link>
        </div>

        {/* 글쓰기 카드 */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/[0.05] bg-[#111111]/30">
          <div className="flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
              <PenLine size={16} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">커뮤니티 글쓰기</h1>
              <p className="text-[10px] text-zinc-500 font-bold">자유롭게 정보를 나누고, 레플리카 팁과 일상을 나누어보세요.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* 카테고리 & 작성자 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-2">카테고리</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-11 px-4 bg-[#111111] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-gold/30 font-bold cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#111111] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 font-bold mb-2">닉네임</label>
                <input
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={10}
                  className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
                />
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-zinc-400 font-bold mb-2">제목</label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
              />
            </div>

            {/* 본문 */}
            <div>
              <label className="block text-zinc-400 font-bold mb-2">내용</label>
              <textarea
                placeholder="커뮤니티 이용 규칙을 준수하여 작성해주세요. 비방, 욕설, 광고글은 예고 없이 삭제될 수 있습니다."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-medium leading-relaxed whitespace-pre-wrap"
              />
            </div>

            {/* 이미지 첨부 시뮬레이션 */}
            <div className="border border-white/[0.04] rounded-xl p-4 bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={14} className="text-gold" />
                <span className="text-zinc-300 font-bold">이미지 첨부 시뮬레이션</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold mb-4">
                서버가 없는 정적 사이트이므로 아래의 목업 이미지 중 하나를 선택하거나, 웹 상의 이미지 URL을 입력할 수 있습니다.
              </p>

              {/* 이미지 타입 토글 */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setImageType("preset")}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                    imageType === "preset"
                      ? "bg-gold/10 text-gold border-gold/20"
                      : "bg-white/[0.02] text-zinc-500 border-white/[0.04] hover:text-white"
                  }`}
                >
                  대표 시계/가방 이미지 선택
                </button>
                <button
                  type="button"
                  onClick={() => setImageType("url")}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                    imageType === "url"
                      ? "bg-gold/10 text-gold border-gold/20"
                      : "bg-white/[0.02] text-zinc-500 border-white/[0.04] hover:text-white"
                  }`}
                >
                  외부 이미지 URL 입력
                </button>
              </div>

              {imageType === "preset" ? (
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5">샘플 이미지 선택</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.value}
                        type="button"
                        onClick={() => setPresetImage(img.value)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                          presetImage === img.value
                            ? "border-gold bg-gold/5 text-gold"
                            : "border-white/[0.05] bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                        }`}
                      >
                        <span className="truncate pr-2">{img.label}</span>
                        {presetImage === img.value && <Check size={12} className="shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {presetImage && (
                    <div className="mt-4 max-w-xs rounded-lg overflow-hidden border border-white/[0.08] bg-zinc-900">
                      <img src={presetImage} alt="선택한 썸네일 미리보기" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5">이미지 주소 (URL)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg 형식의 주소를 입력하세요."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
                  />
                  {customImageUrl.trim() && (
                    <div className="mt-4 max-w-xs rounded-lg overflow-hidden border border-white/[0.08] bg-zinc-900">
                      <img 
                        src={customImageUrl.trim()} 
                        alt="입력한 이미지 미리보기" 
                        onError={(e) => {
                          // 잘못된 이미지 주소 처리
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500";
                        }}
                        className="w-full h-auto object-cover" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.05]">
              <Link
                href="/community"
                className="px-5 py-2.5 bg-white/[0.02] border border-white/[0.06] text-zinc-400 font-bold rounded-lg hover:text-white hover:bg-white/[0.05] transition-all"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gold text-black font-black rounded-lg hover:bg-gold-light hover:shadow-md hover:shadow-gold/20 transition-all disabled:opacity-50"
              >
                <PenLine size={12} /> {isSubmitting ? "등록 중..." : "글 등록하기"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

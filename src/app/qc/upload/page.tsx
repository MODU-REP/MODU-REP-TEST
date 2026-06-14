"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, Image as ImageIcon, Check } from "lucide-react";
import { QC_POSTS } from "@/lib/data";

const CATEGORIES = ["시계", "가방"] as const;
const STATUS_TYPES = ["QC", "GL", "RL"] as const;

const PRESET_IMAGES = [
  { label: "롤렉스 서브마리너 126610LN", value: "/hero_pc_1.png", preview: "/hero_pc_1.png" },
  { label: "샤넬 클래식 플랩백 (가죽)", value: "/hero_bag_2.png", preview: "/hero_bag_2.png" },
  { label: "롤렉스 코스모그래프 데이토나", value: "/hero_pc_2.png", preview: "/hero_pc_2.png" },
  { label: "오메가 스피드마스터 문워치", value: "/hero_pc_3.png", preview: "/hero_pc_3.png" },
  { label: "롤렉스 데이트저스트 126334", value: "/hero_watch_3.png", preview: "/hero_watch_3.png" },
];

export default function QCUploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("시계");
  const [type, setType] = useState<typeof STATUS_TYPES[number]>("QC");
  const [factory, setFactory] = useState("Clean Factory");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("₩580");
  const [author, setAuthor] = useState("렙마스터");
  
  // 페이크포인트 검사 정보
  const [dialSpec, setDialSpec] = useState("정렬 양호, 인쇄 선명함");
  const [bezelSpec, setBezelSpec] = useState("12시 방향 정렬 양호, 인서트 단차 없음");
  const [rehautSpec, setRehautSpec] = useState("인그레이빙 대칭 양호");
  const [datewheelSpec, setDatewheelSpec] = useState("날짜 정중앙 정렬");
  const [claspSpec, setClaspSpec] = useState("버클 잠금 질감 양호, 글라스 투과율 높음");
  
  // 이미지
  const [imageType, setImageType] = useState<"preset" | "url">("preset");
  const [presetImage, setPresetImage] = useState("/hero_pc_1.png");
  const [customImageUrl, setCustomImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("제목을 입력해주세요.");
      return;
    }
    if (!model.trim()) {
      setErrorMessage("상세 모델명을 입력해주세요.");
      return;
    }
    if (!factory.trim()) {
      setErrorMessage("제조 공장명을 입력해주세요.");
      return;
    }
    if (!author.trim()) {
      setErrorMessage("작성자명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. 기존 게시글 로드
      let currentPosts: any[] = [];
      const stored = localStorage.getItem("qc_posts");
      if (stored) {
        try {
          currentPosts = JSON.parse(stored);
        } catch (err) {
          currentPosts = [];
        }
      }

      // ID 생성 (가장 큰 ID + 1000 혹은 기존 게시글에서 +1)
      const nextId = currentPosts.length > 0 
        ? Math.max(...currentPosts.map((p: any) => p.id), ...QC_POSTS.map(p => p.id)) + 1 
        : Math.max(...QC_POSTS.map(p => p.id)) + 1;

      const finalImage = imageType === "preset" ? presetImage : customImageUrl.trim();
      const imagesList = finalImage ? [finalImage] : ["/hero_pc_1.png"];

      // 새 QC 포스트 객체 생성
      const newPost = {
        id: nextId,
        category,
        type,
        factory: factory.trim(),
        model: model.trim(),
        title: title.trim(),
        author: author.trim(),
        avatar: author.trim().charAt(0) || "익",
        views: 1,
        time: "방금 전",
        price: price.trim(),
        images: imagesList,
        glVotes: type === "GL" ? 1 : 0,
        rlVotes: type === "RL" ? 1 : 0,
        commentsCount: 0,
        specs: {
          dial: dialSpec.trim(),
          bezel: bezelSpec.trim(),
          rehaut: rehautSpec.trim(),
          datewheel: datewheelSpec.trim(),
          clasp: claspSpec.trim(),
        },
        comments: []
      };

      // 저장 및 리다이렉트
      const updatedPosts = [newPost, ...currentPosts];
      localStorage.setItem("qc_posts", JSON.stringify(updatedPosts));

      router.push("/qc");
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
          <Link href="/qc" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-gold transition-colors">
            <ArrowLeft size={14} /> QC 갤러리로 돌아가기
          </Link>
        </div>

        {/* 글쓰기 카드 */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-white/[0.05] bg-[#111111]/30">
          <div className="flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
              <Camera size={16} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">QC 글쓰기</h1>
              <p className="text-[10px] text-zinc-500 font-bold">공장에서 받은 검수 사진을 업로드하고, 커뮤니티의 검증을 받아보세요.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* 제목 */}
            <div>
              <label className="block text-zinc-400 font-bold mb-2">제목</label>
              <input
                type="text"
                placeholder="예) [검수요청] Clean 데이토나 126500 흰판 스틸 인덱스 체크 부탁드립니다"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
              />
            </div>

            {/* 분류 & 판정상태 */}
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
                <label className="block text-zinc-400 font-bold mb-2">현재 판정상태</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-11 px-4 bg-[#111111] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-gold/30 font-bold cursor-pointer"
                >
                  {STATUS_TYPES.map((st) => (
                    <option key={st} value={st} className="bg-[#111111] text-white">
                      {st} ({st === "QC" ? "투표 대기" : st === "GL" ? "자체 합격" : "자체 재요청"})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 공장 & 모델 & 가격 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-2">제조 공장명</label>
                <input
                  type="text"
                  placeholder="예) Clean Factory, VSF"
                  value={factory}
                  onChange={(e) => setFactory(e.target.value)}
                  className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-bold mb-2">상세 모델명</label>
                <input
                  type="text"
                  placeholder="예) 데이토나 126500"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-bold mb-2">TD 출고 가격 / 닉네임</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="예) ₩780"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-11 px-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold text-center"
                  />
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full h-11 px-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-gold/30 font-bold text-center"
                  />
                </div>
              </div>
            </div>

            {/* 📋 페이크포인트 검사 세부 사양 */}
            <div className="border border-white/[0.04] rounded-xl p-4 bg-white/[0.01] space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-zinc-300 font-bold">페이크포인트 검사 정보 기입</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5">다이얼 &amp; 핸즈 사양</label>
                  <input
                    type="text"
                    value={dialSpec}
                    onChange={(e) => setDialSpec(e.target.value)}
                    className="w-full h-10 px-3 bg-[#111111] border border-white/[0.08] rounded-xl text-zinc-300 focus:outline-none focus:border-gold/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5">베젤 &amp; 인서트 사양</label>
                  <input
                    type="text"
                    value={bezelSpec}
                    onChange={(e) => setBezelSpec(e.target.value)}
                    className="w-full h-10 px-3 bg-[#111111] border border-white/[0.08] rounded-xl text-zinc-300 focus:outline-none focus:border-gold/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5">레하우 각인 사양</label>
                  <input
                    type="text"
                    value={rehautSpec}
                    onChange={(e) => setRehautSpec(e.target.value)}
                    className="w-full h-10 px-3 bg-[#111111] border border-white/[0.08] rounded-xl text-zinc-300 focus:outline-none focus:border-gold/30 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-bold mb-1.5">날짜창 (DW) 사양</label>
                  <input
                    type="text"
                    value={datewheelSpec}
                    onChange={(e) => setDatewheelSpec(e.target.value)}
                    className="w-full h-10 px-3 bg-[#111111] border border-white/[0.08] rounded-xl text-zinc-300 focus:outline-none focus:border-gold/30 font-bold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-zinc-500 font-bold mb-1.5">버클 &amp; 글라스 사양</label>
                  <input
                    type="text"
                    value={claspSpec}
                    onChange={(e) => setClaspSpec(e.target.value)}
                    className="w-full h-10 px-3 bg-[#111111] border border-white/[0.08] rounded-xl text-zinc-300 focus:outline-none focus:border-gold/30 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 이미지 첨부 */}
            <div className="border border-white/[0.04] rounded-xl p-4 bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon size={14} className="text-gold" />
                <span className="text-zinc-300 font-bold">QC 이미지 업로드 시뮬레이션</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold mb-4">
                가상 환경이므로 목업 이미지를 선택하거나 직접 사진 URL을 첨부할 수 있습니다.
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
                  목업 이미지 샘플 선택
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
                  이미지 URL 직접 입력
                </button>
              </div>

              {imageType === "preset" ? (
                <div>
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
                      <img src={presetImage} alt="미리보기" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
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
                href="/qc"
                className="px-5 py-2.5 bg-white/[0.02] border border-white/[0.06] text-zinc-400 font-bold rounded-lg hover:text-white hover:bg-white/[0.05] transition-all"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gold text-black font-black rounded-lg hover:bg-gold-light hover:shadow-md hover:shadow-gold/20 transition-all disabled:opacity-50"
              >
                <Camera size={12} /> {isSubmitting ? "등록 중..." : "QC 등록하기"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

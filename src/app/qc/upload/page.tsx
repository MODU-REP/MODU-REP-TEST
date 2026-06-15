"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, Image as ImageIcon, Check, HelpCircle } from "lucide-react";
import { QC_POSTS } from "@/lib/data";

const CATEGORIES = ["시계", "가방"] as const;
const STATUS_TYPES = ["QC", "GL", "RL"] as const;

const WATCH_CONCERNS = ["인덱스", "베젤", "날짜창", "다이얼", "전체 검수"];
const BAG_CONCERNS = ["로고/박임", "스티칭/대칭", "가죽 질감", "하드웨어/도금", "전체 검수"];

const PRESET_IMAGES = [
  { label: "롤렉스 서브마리너 126610LN", value: "/hero_pc_1.png" },
  { label: "샤넬 클래식 플랩백 (가죽)", value: "/hero_bag_2.png" },
  { label: "롤렉스 코스모그래프 데이토나", value: "/hero_pc_2.png" },
  { label: "오메가 스피드마스터 문워치", value: "/hero_pc_3.png" },
  { label: "롤렉스 데이트저스트 126334", value: "/hero_watch_3.png" },
];

export default function QCUploadPage() {
  const router = useRouter();
  
  // 핵심 상태 변수
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("시계");
  const [type, setType] = useState<typeof STATUS_TYPES[number]>("QC");
  const [factory, setFactory] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState(""); // 판매처 저장
  const [author, setAuthor] = useState("렙마스터");
  
  // 체크박스 & 메모 상태 변수
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  
  // 이미지
  const [imageType, setImageType] = useState<"preset" | "url">("preset");
  const [presetImage, setPresetImage] = useState("/hero_pc_1.png");
  const [customImageUrl, setCustomImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const concernsList = category === "시계" ? WATCH_CONCERNS : BAG_CONCERNS;

  const handleCategoryChange = (cat: typeof CATEGORIES[number]) => {
    setCategory(cat);
    setSelectedConcerns([]);
    setPresetImage(cat === "시계" ? "/hero_pc_1.png" : "/hero_bag_2.png");
  };

  const handleToggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const getConcernGuide = (name: string) => {
    if (category === "시계") {
      switch (name) {
        case "인덱스": return "12시 방향 왕관/더블바 마커 정렬 상태, 각 아워 마커 인덱스의 수평도 및 부착 유격 체크";
        case "베젤": return "세라믹 인서트 음각 플래티넘 도금의 균일도, 12시 방향 역삼각 야광점 정중앙 정렬 체크";
        case "날짜창": return "데이트휠 인쇄 폰트 두께 및 번짐 상태, 날짜 창 숫자의 좌우/상하 센터링 정렬 체크";
        case "다이얼": return "다이얼 인쇄 텍스트 정밀도(로고 및 왕관), 핸즈 정렬 상태, 인덱스 야광 도포 균일성 체크";
        case "전체 검수": return "사파이어 글라스 투과율 및 단차, 브레이슬릿 엔드링크(SEL) 유격, 버클 결합 및 각인 마감 체크";
        default: return "";
      }
    } else {
      switch (name) {
        case "로고/박임": return "엠보싱 로고 철자 정밀도 및 자간 간격, 금박/은박 각인의 번짐 상태 및 수평 정렬 체크";
        case "스티칭/대칭": return "다이아몬드 퀼팅/패턴 정밀 대칭, 스티치 바느질의 일정한 간격 및 기리메 마감 체크";
        case "가죽 질감": return "가죽 표면 광택도 및 고유 모공/질감 구현도, 패턴 대칭 구조 체크";
        case "하드웨어/도금": return "체인 및 잠금 장치 금속의 도금 톤(색감), 정각인 상태 및 버클 스크래치 체크";
        case "전체 검수": return "가방 전체 쉐입(형태) 좌우 대칭, 플랩 내부 안감 정돈 및 가죽 절개부 마감 처리 체크";
        default: return "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      setErrorMessage("모델명을 입력해주세요.");
      return;
    }
    if (!factory.trim()) {
      setErrorMessage("공장명을 입력해주세요.");
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

      // ID 생성
      const nextId = currentPosts.length > 0 
        ? Math.max(...currentPosts.map((p: any) => p.id), ...QC_POSTS.map(p => p.id)) + 1 
        : Math.max(...QC_POSTS.map(p => p.id)) + 1;

      const finalImage = imageType === "preset" ? presetImage : customImageUrl.trim();
      const imagesList = finalImage ? [finalImage] : [category === "시계" ? "/hero_pc_1.png" : "/hero_bag_2.png"];

      // 자동 제목 생성
      const finalTitle = `[검수요청] ${factory.trim()} ${model.trim()}`;

      // 페이크포인트 스펙 자동 매핑 및 빌드
      const getSpecValue = (concernKey: string, defaultDesc: string) => {
        const isConcerned = selectedConcerns.includes(concernKey) || selectedConcerns.includes("전체 검수");
        if (isConcerned) {
          let val = `⚠️ [검수 요청] ${defaultDesc}`;
          if (memo.trim()) {
            val += ` (${memo.trim()})`;
          }
          return val;
        }
        return "양호 (정상 범위)";
      };

      let specs = {
        dial: "",
        bezel: "",
        rehaut: "",
        datewheel: "",
        clasp: "",
      };

      if (category === "시계") {
        specs = {
          dial: getSpecValue("다이얼", "다이얼 인쇄 텍스트 정밀도(로고 및 왕관), 핸즈 정렬 상태, 인덱스 야광 도포 균일성 체크"),
          bezel: getSpecValue("베젤", "세라믹 인서트 음각 플래티넘 도금의 균일도, 12시 방향 역삼각 야광점 정중앙 정렬 체크"),
          rehaut: getSpecValue("인덱스", "12시 방향 왕관/더블바 마커 정렬 상태, 각 아워 마커 인덱스의 수평도 및 부착 유격 체크"),
          datewheel: getSpecValue("날짜창", "데이트휠 인쇄 폰트 두께 및 번짐 상태, 날짜 창 숫자의 좌우/상하 센터링 정렬 체크"),
          clasp: getSpecValue("전체 검수", "사파이어 글라스 투과율 및 단차, 브레이슬릿 엔드링크(SEL) 유격, 버클 결합 및 각인 마감 체크"),
        };
      } else {
        // 가방
        specs = {
          dial: getSpecValue("로고/박임", "엠보싱 로고 철자 정밀도 및 자간 간격, 금박/은박 각인의 번짐 상태 및 수평 정렬 체크"),
          bezel: getSpecValue("가죽 질감", "가죽 표면 광택도 및 고유 모공/질감 구현도, 패턴 대칭 구조 체크"),
          rehaut: getSpecValue("스티칭/대칭", "다이아몬드 퀼팅/패턴 정밀 대칭, 스티치 바느질의 일정한 간격 및 기리메 마감 체크"),
          datewheel: getSpecValue("하드웨어/도금", "체인 및 잠금 장치 금속의 도금 톤(색감), 정각인 상태 및 버클 스크래치 체크"),
          clasp: getSpecValue("전체 검수", "가방 전체 쉐입(형태) 좌우 대칭, 플랩 내부 안감 정돈 및 가죽 절개부 마감 처리 체크"),
        };
      }

      // 새 QC 포스트 객체 생성
      const newPost = {
        id: nextId,
        category,
        type,
        factory: factory.trim(),
        model: model.trim(),
        title: finalTitle,
        author: author.trim() || "렙마스터",
        avatar: (author.trim() || "렙").charAt(0),
        views: 1,
        time: "방금 전",
        price: price.trim() || "미기재", // 판매처로 저장
        images: imagesList,
        glVotes: type === "GL" ? 1 : 0,
        rlVotes: type === "RL" ? 1 : 0,
        commentsCount: 0,
        specs,
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
      <div className="max-w-[1100px] mx-auto px-3 sm:px-4 py-6">
        
        {/* 뒤로가기 */}
        <div className="mb-4">
          <Link href="/qc" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-gold transition-colors">
            <ArrowLeft size={14} /> QC 투표로 돌아가기
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6 items-start">
          {/* 글쓰기 카드 (좌측 칼럼) */}
          <div className="glass rounded-2xl p-6 sm:p-8 border border-white/[0.05] bg-[#111111]/30">
          <div className="flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
              <Camera size={16} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">QC 글쓰기</h1>
              <p className="text-[10px] text-zinc-500 font-bold">공장에서 받은 검수 사진을 업로드하고, 회원들의 검수 투표를 받아보세요.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-zinc-400 font-bold mb-2">카테고리</label>
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 ${
                      category === cat 
                        ? "bg-gold text-black font-bold" 
                        : "bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white border border-white/[0.04]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 모델명 & 공장명 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-2">모델명</label>
                <input
                  type="text"
                  placeholder="예) 서브마리너 126610LN, 클래식 플랩백 등"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-bold mb-2">공장명</label>
                <input
                  type="text"
                  placeholder="예) Clean, VSF, 187 등"
                  value={factory}
                  onChange={(e) => setFactory(e.target.value)}
                  className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
                />
              </div>
            </div>

            {/* 판매처 & 판정상태 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 font-bold mb-2">판매처 (선택)</label>
                <input
                  type="text"
                  placeholder="예) Geek Time, Hont Watch, 국딜 등"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-bold mb-2">현재 의견</label>
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

            {/* 📋 궁금한 점 체크박스 */}
            <div className="border border-white/[0.04] rounded-xl p-4 bg-white/[0.01] space-y-4">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">궁금한 점 (선택)</label>
                <p className="text-[10px] text-zinc-500 font-bold">특히 신경 쓰이는 포인트를 선택해 주세요. 커뮤니티가 그 부분을 집중 분석해 줍니다.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {concernsList.map((item) => {
                  const isChecked = selectedConcerns.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleConcern(item)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left font-bold transition-all ${
                        isChecked
                          ? "border-gold bg-gold/5 text-gold"
                          : "border-white/[0.05] bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                        isChecked ? "border-gold bg-gold text-black" : "border-zinc-700"
                      }`}>
                        {isChecked && <Check size={10} strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] font-bold">{item}</span>
                    </button>
                  );
                })}
              </div>

              {/* 실시간 가이드라인 표시 */}
              {selectedConcerns.length > 0 && (
                <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-2">
                  <span className="text-[10px] text-zinc-500 font-bold block mb-1">선택 부위별 검수 기준 가이드:</span>
                  {selectedConcerns.map((concernName) => {
                    const guideText = getConcernGuide(concernName);
                    return (
                      <div key={concernName} className="text-[11px] leading-relaxed text-zinc-400">
                        <span className="text-gold font-bold mr-1.5">• {concernName}:</span>
                        {guideText}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 모바일/태블릿용 가이드라인 아코디언 */}
              <div className="lg:hidden">
                <details className="group border border-white/[0.05] bg-white/[0.01] rounded-xl overflow-hidden transition-all">
                  <summary className="flex items-center justify-between px-3.5 py-2.5 text-[10px] font-black text-zinc-400 cursor-pointer hover:bg-white/[0.02] select-none">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle size={12} className="text-gold" />
                      부위별 용어 가이드 보기 ({category})
                    </span>
                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-3 border-t border-white/[0.04] bg-zinc-950/40">
                    <img 
                      src={category === "시계" ? "/watch_parts_guide.png" : "/bag_parts_guide.png"} 
                      alt={`${category} 용어 가이드`} 
                      className="w-full h-auto rounded-lg border border-white/[0.04]" 
                    />
                  </div>
                </details>
              </div>

              {/* 추가 메모 textarea */}
              <div className="pt-2">
                <label className="block text-zinc-500 font-bold mb-1.5">추가 메모 (선택)</label>
                <textarea
                  placeholder="예) 6시 방향 정렬 상태가 조금 삐뚤어져 보이는지 궁금합니다."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full h-20 p-3 bg-[#111111] border border-white/[0.08] rounded-xl text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 font-bold resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* 이미지 첨부 */}
            <div className="border border-white/[0.04] rounded-xl p-4 bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon size={14} className="text-gold" />
                <span className="text-zinc-300 font-bold">QC 이미지 업로드</span>
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
                  샘플 이미지 선택
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
                    <div className="mt-4 max-w-xs rounded-lg overflow-hidden border border-white/[0.08] bg-zinc-950">
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
                    <div className="mt-4 max-w-xs rounded-lg overflow-hidden border border-white/[0.08] bg-zinc-950">
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

        {/* 우측 칼럼: 부위별 용어 가이드 카드 (데스크톱 전용) */}
        <div className="hidden lg:block glass rounded-2xl p-5 border border-white/[0.05] bg-[#111111]/30 sticky top-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
            <HelpCircle size={14} className="text-gold" />
            부위별 용어 가이드 ({category})
          </h3>
          <p className="text-[10px] text-zinc-500 font-bold mb-4 leading-normal">
            시계/가방의 검수 용어 위치가 헷갈린다면 아래 가이드를 참고하세요.
          </p>
          <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-zinc-950">
            <img 
              src={category === "시계" ? "/watch_parts_guide.png" : "/bag_parts_guide.png"} 
              alt={`${category} 용어 가이드`} 
              className="w-full h-auto object-cover" 
            />
          </div>
        </div>

      </div>
    </div>
  </div>
  );
}

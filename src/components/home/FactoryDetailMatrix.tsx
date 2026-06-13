"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, CheckCircle2, Shield, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

const FACTORIES = [
  {
    id: "vsf",
    name: "VSF (VS Factory)",
    grade: "SSS급",
    rating: 4.9,
    category: "rolex",
    satisfaction: 98,
    specialty: "롤렉스 서브마리너 & 데이트저스트",
    strengths: [
      "독점 개발 3135 / 3235 복제 무브먼트 (정품급 안정성과 데이트 변경 속도)",
      "글라스 투과율 및 싸이클롭스(배율 렌즈) 왜곡 최소화",
      "베젤 세라믹 컬러 싱크 및 부드러운 회전 감도",
    ],
    topModels: ["서브마리너 126610LN", "데이트저스트 41 쥬빌리", "오메가 씨마스터 300"],
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    id: "clean",
    name: "Clean Factory (클린공장)",
    grade: "SSS급",
    rating: 4.8,
    category: "rolex",
    satisfaction: 96,
    specialty: "롤렉스 데이토나 & GMT-Master II",
    strengths: [
      "최상의 세라믹 인서트 베젤 각인 (색감 및 입체감 업계 1위)",
      "데이토나 4130 크로노그래프 무브먼트 탑재 (두께 정품과 1:1 일치)",
      "케이스 904L 스틸 마감 쉐입 및 브레이슬릿 체결부 유격 최소화",
    ],
    topModels: ["데이토나 116520 세라믹", "GMT-Master II 펩시/배트맨", "서브마리너 126610LV"],
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    id: "zf",
    name: "ZF (Z Factory)",
    grade: "SS급",
    rating: 4.6,
    category: "ap",
    satisfaction: 94,
    specialty: "오데마 피게 로얄오크 & IWC",
    strengths: [
      "로얄오크 15400 / 15500 케이스 초박형 두께 완벽 재현",
      "와플 패턴 다이얼의 정교한 질감 및 각도에 따른 난반사 구현",
      "IWC 포르투기저 크로노그래프 다이얼 프린팅 및 핸즈 블루 스틸 처리",
    ],
    topModels: ["로얄오크 15500 블루", "IWC 포르투기저 3714", "파텍필립 아쿠아넛 5167"],
    badgeColor: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
  },
  {
    id: "187",
    name: "187 Factory",
    grade: "SSS급",
    rating: 4.7,
    category: "bags",
    satisfaction: 95,
    specialty: "샤넬 핸드백 가방 라인업",
    strengths: [
      "오리지널 이탈리아 수입 하스(HAAS) 카프스킨 가죽 사용",
      "수작업 스티치(핸드메이드 바느질) 마감 및 퀼팅 엠보 볼륨감 구현",
      "금장/은장 체인 도금 퀄리티 및 가죽 체인 꼬임 마감 우수",
    ],
    topModels: ["샤넬 클래식 플랩백 금장", "샤넬 가브리엘 백팩", "샤넬 22백"],
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
];

export function FactoryDetailMatrix() {
  const [activeTab, setActiveTab] = useState<"all" | "rolex" | "ap" | "bags">("all");

  const filteredFactories = FACTORIES.filter(
    (f) => activeTab === "all" || f.category === activeTab
  );

  return (
    <section className="py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award size={18} className="text-gold animate-pulse" /> 공장별 전문 가이드 매트릭스
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            글로벌 제조사별 대표 기술력과 핵심 부품 경쟁력을 객관적으로 분석한 팩토리 가이드
          </p>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex bg-zinc-900 border border-white/5 rounded-lg p-0.5 self-start shrink-0">
          {(["all", "rolex", "ap", "bags"] as const).map((tab) => {
            const labels = {
              all: "전체",
              rolex: "롤렉스 전문",
              ap: "AP 전문",
              bags: "가방/잡화",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-gold text-black shadow-md shadow-gold/10"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredFactories.map((factory, index) => (
            <motion.div
              key={factory.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="glass-card rounded-xl p-5 border border-white/[0.06] hover:border-gold/30 hover:shadow-lg hover:shadow-gold/[0.02] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.01] rounded-full blur-xl group-hover:bg-gold/[0.03] transition-all pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors">
                      {factory.name}
                    </h3>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border shrink-0 ${factory.badgeColor}`}>
                      {factory.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 font-medium">
                    주요 강점 분야: <span className="text-white font-semibold">{factory.specialty}</span>
                  </p>
                </div>

                {/* Rating */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1 text-yellow-400">
                    <Star size={11} fill="currentColor" />
                    <span className="text-xs font-bold">{factory.rating}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500">평점</span>
                </div>
              </div>

              {/* Progress: User Satisfaction */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1 text-[10px]">
                  <span className="text-zinc-500 font-medium">종합 기술력 만족도</span>
                  <span className="text-gold font-bold">{factory.satisfaction}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold to-yellow-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${factory.satisfaction}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Detailed Strengths */}
              <div className="space-y-2 mb-4 border-t border-b border-white/[0.04] py-3">
                <h4 className="text-[11px] font-bold text-gold/80 flex items-center gap-1">
                  <CheckCircle2 size={11} /> 기술 및 부품 장점
                </h4>
                <ul className="space-y-1.5">
                  {factory.strengths.map((str, i) => (
                    <li key={i} className="text-[11px] text-zinc-400 leading-relaxed flex items-start gap-1.5">
                      <span className="text-gold shrink-0 mt-1.5 block w-1 h-1 rounded-full bg-gold" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Representative Models */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-zinc-500 font-medium shrink-0">대표 추천작:</span>
                  {factory.topModels.map((model) => (
                    <span
                      key={model}
                      className="text-[9px] text-zinc-300 bg-white/5 border border-white/[0.05] rounded px-1.5 py-0.5 group-hover:border-gold/10 transition-colors"
                    >
                      {model}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/factories/${factory.id}`}
                  className="text-[10px] text-zinc-400 group-hover:text-gold font-bold flex items-center gap-0.5 transition-colors shrink-0"
                >
                  분석 보기 <ChevronRight size={11} />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

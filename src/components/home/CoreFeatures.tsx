"use client";

import { motion } from "framer-motion";
import { Camera, TrendingUp, Building2, MessageSquareText } from "lucide-react";

const FEATURES = [
  {
    icon: Camera,
    title: "실시간 QC 집단지성",
    description: "유저들과 전문가들이 업로드된 QC 사진을 다각도로 분석하고 조언을 나누어 GL/RL 결정을 실패 없이 돕습니다.",
    badge: "QC 검증",
  },
  {
    icon: TrendingUp,
    title: "투명한 시세 트렌드",
    description: "해외 주요 공장별, 모델별 최근 시세 실시간 변동 추이를 투명하고 정교한 차트 데이터로 한눈에 비교 분석합니다.",
    badge: "데이터 분석",
  },
  {
    icon: Building2,
    title: "공장 정보 및 랭킹",
    description: "VSF, Clean, ZF, PPF 등 글로벌 공장들의 실시간 유저 평점과 퀄리티 순위 데이터를 숨김없이 투명하게 제공합니다.",
    badge: "제조사 랭킹",
  },
  {
    icon: MessageSquareText,
    title: "검증된 유저 실착 후기",
    description: "스폰서 없는 100% 리얼 실착 유저들의 마감 디테일, 소재 질감, 오차 분석 등 가치 있는 경험을 직접 공유합니다.",
    badge: "솔직 후기",
  },
];

export function CoreFeatures() {
  return (
    <section className="py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold text-gold uppercase tracking-wider mb-2"
        >
          WHY MODUREP
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-black text-white leading-tight"
        >
          모두의 렙이 제공하는<br />
          <span className="text-gradient-gold">네 가지 핵심 가치</span>
        </motion.h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card rounded-xl p-5 relative overflow-hidden group hover:border-gold/30"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.02] rounded-full blur-xl group-hover:bg-gold/[0.05] transition-all" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300">
                <feature.icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 group-hover:text-gold group-hover:border-gold/20 transition-colors">
                {feature.badge}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2 group-hover:text-gold transition-colors">
              {feature.title}
            </h3>
            
            <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

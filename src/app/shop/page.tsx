"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, MessageSquare, Clock, Star, ChevronRight, BadgeCheck, HeadphonesIcon } from "lucide-react";
import Link from "next/link";

const DEALERS = [
  { id: 1, name: "Hont Watch", rating: 4.9, reviews: 1243, specialty: "Rolex, Omega", responseTime: "2시간 이내", verified: true, tier: "Premium" },
  { id: 2, name: "Geek Time", rating: 4.8, reviews: 987, specialty: "전 브랜드", responseTime: "4시간 이내", verified: true, tier: "Premium" },
  { id: 3, name: "Eric Watch", rating: 4.7, reviews: 654, specialty: "Rolex, AP", responseTime: "6시간 이내", verified: true, tier: "Trusted" },
  { id: 4, name: "Miro Time", rating: 4.6, reviews: 432, specialty: "가방 전문", responseTime: "3시간 이내", verified: true, tier: "Trusted" },
  { id: 5, name: "JTime", rating: 4.7, reviews: 876, specialty: "시계 전문", responseTime: "4시간 이내", verified: true, tier: "Premium" },
];

const STEPS = [
  { step: 1, title: "모델 선택", desc: "원하는 모델과 공장을 선택하세요", icon: "🔍" },
  { step: 2, title: "딜러 문의", desc: "검증된 딜러에게 견적을 받으세요", icon: "💬" },
  { step: 3, title: "QC 확인", desc: "QC 사진을 받고 커뮤니티에서 검수 받으세요", icon: "📸" },
  { step: 4, title: "결제 & 배송", desc: "GL 후 결제하고 배송을 기다리세요", icon: "📦" },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
        {/* Hero */}
        <div className="glass rounded-2xl p-6 lg:p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">구매센터</h1>
          <p className="text-sm text-zinc-400 mb-6 max-w-lg">검증된 딜러를 통해 안전하게 구매하세요. 모든 딜러는 커뮤니티 인증을 거쳤습니다.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: ShieldCheck, label: "인증 딜러만", desc: "커뮤니티 검증 완료" },
              { icon: Truck, label: "배송 추적", desc: "실시간 배송 현황" },
              { icon: MessageSquare, label: "1:1 상담", desc: "한국어 지원" },
              { icon: HeadphonesIcon, label: "A/S 지원", desc: "구매 후 관리" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold">{label}</p>
                  <p className="text-[10px] text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Steps */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">구매 프로세스</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4 text-center relative"
              >
                <div className="text-2xl mb-2">{step.icon}</div>
                <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center justify-center">{step.step}</div>
                <p className="text-sm font-bold mb-1">{step.title}</p>
                <p className="text-[11px] text-zinc-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dealers */}
        <div>
          <h2 className="text-lg font-bold mb-4">인증 딜러</h2>
          <div className="space-y-3">
            {DEALERS.map((dealer, i) => (
              <motion.div
                key={dealer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/shop/${dealer.id}`} className="block glass rounded-xl p-4 card-hover group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold font-black text-sm border border-gold/20">
                        {dealer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{dealer.name}</p>
                          {dealer.verified && <BadgeCheck size={14} className="text-blue-400" />}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${dealer.tier === "Premium" ? "bg-gold/20 text-gold" : "bg-blue-500/20 text-blue-400"}`}>{dealer.tier}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500">{dealer.specialty} · 응답 {dealer.responseTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400" fill="currentColor" />
                          <span className="text-sm font-bold">{dealer.rating}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500">리뷰 {dealer.reviews}</p>
                      </div>
                      <ChevronRight size={16} className="text-zinc-600 group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-gold rounded-2xl p-6 mt-8 text-center">
          <h3 className="text-lg font-bold mb-2">원하는 모델을 찾지 못하셨나요?</h3>
          <p className="text-sm text-zinc-400 mb-4">구매 문의를 남겨주시면 최적의 딜러를 매칭해드립니다.</p>
          <button className="px-6 py-2.5 bg-gold text-black font-bold text-sm rounded-full hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 transition-all">
            구매 문의하기
          </button>
        </div>
      </div>
    </div>
  );
}

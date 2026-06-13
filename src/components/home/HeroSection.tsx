"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    pcImage: "/hero_pc_1.png",
    mobileImage: "/hero_mobile_1.png",
    title: "최상위 공장별 리얼 검증 데이터",
    desc: "VSF, Clean 등 최상위 제조사들의 상세 스펙 비교",
  },
  {
    pcImage: "/hero_bag_2.png",
    mobileImage: "/hero_mobile_2.png",
    title: "100% 검증된 가죽 및 부품 퀄리티",
    desc: "수입 가죽 및 수작업 스티치의 정교한 디테일",
  },
  {
    pcImage: "/hero_pc_3.png",
    mobileImage: "/hero_mobile_3.png",
    title: "에스크로 기반 안전 거래 환경",
    desc: "먹튀나 단속 걱정 없는 안전한 거래 정보 제공",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section className="relative w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 overflow-hidden rounded-none sm:rounded-2xl border-x-0 border-y sm:border border-white/[0.06] bg-[#0A0A0A] mt-2 mb-6 shadow-2xl shadow-black/40 min-h-[460px] sm:min-h-[500px] lg:min-h-[480px] flex flex-col justify-center">
      {/* Sliding Background Image Carousel */}
      {/* On desktop (lg), restrict width to 65% and align right to prevent upscaling blurriness and keep it sharp */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[65%] z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <picture className="w-full h-full">
              <source media="(min-width: 1024px)" srcSet={SLIDES[current].pcImage} />
              <img
                src={SLIDES[current].mobileImage}
                alt={SLIDES[current].title}
                className="w-full h-full object-cover object-center select-none"
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* Cinematic dark overlays on top of the image container to blend it into the solid card background */}
        {/* For PC (lg): Dark fade from left to right, starting from solid background color */}
        <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 hidden lg:block pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[30%] bg-gradient-to-l from-black/40 to-transparent z-10 hidden lg:block pointer-events-none" />

        {/* For Mobile (< lg): Dark fade from top/bottom to center to ensure text and controls readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-[#0A0A0A]/95 lg:hidden z-10 pointer-events-none" />
      </div>

      {/* Extra solid background transition area on PC for seamless blending */}
      <div className="absolute inset-y-0 left-0 w-[35%] bg-[#0A0A0A] z-0 hidden lg:block pointer-events-none" />

      {/* Foreground Content: Text & Actions */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-12 sm:px-12 lg:px-16 flex flex-col lg:flex-row lg:items-center justify-between min-h-[460px] sm:min-h-[500px] lg:min-h-[480px]">
        {/* Left text block */}
        <div className="max-w-xl lg:max-w-2xl space-y-6 text-left select-text">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] sm:text-xs font-black text-gold tracking-wider mb-4 uppercase">
              Premium Rep Hub
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] xl:text-[3rem] font-black leading-[1.2] tracking-tight mb-4 text-white">
              진짜보다 더 믿을 수 있는 선택,<br />
              <span className="text-gradient-gold">레플리카 정보 공유 커뮤니티</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg font-medium">
              투명한 제조사별 비교 분석 데이터와 실시간 유저 QC 집단지성, 그리고 먹튀 걱정 없는 안전한 소통 공간을 경험해 보세요.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.25 }} 
            className="flex flex-wrap gap-3"
          >
            <Link href="/community" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-bold text-sm rounded-full hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
              커뮤니티 보기 <ArrowRight size={16} />
            </Link>
            <Link href="/qc" className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-white font-medium text-sm rounded-full hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-all duration-300">
              최신 QC 보기 <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Slide Description & Controls */}
        <div className="mt-8 lg:mt-auto lg:ml-auto w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4">
          <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-left max-w-[60%] sm:max-w-[70%] lg:max-w-[280px] shadow-lg">
            <h3 className="text-xs sm:text-sm font-black text-white truncate">{SLIDES[current].title}</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5 font-medium truncate">{SLIDES[current].desc}</p>
          </div>

          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shrink-0 shadow-lg select-none">
            <button
              onClick={handlePrev}
              className="text-zinc-400 hover:text-white transition-colors"
              title="이전 슬라이드"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-[9px] font-black text-zinc-300 tracking-wider w-8 text-center">
              0{current + 1} / 0{SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              className="text-zinc-400 hover:text-white transition-colors"
              title="다음 슬라이드"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

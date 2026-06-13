"use client";

import React from "react";
import Link from "next/link";
import { Clock, Eye, Calendar, ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import { MAGAZINE_ARTICLES } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const articleId = parseInt(resolvedParams.id);
  const article = MAGAZINE_ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-black">
        <p className="text-zinc-500 font-bold text-sm">해당 매거진 칼럼을 찾을 수 없습니다.</p>
        <Link href="/magazine" className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 text-white transition-colors">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // 본문 문단을 나눔
  const paragraphs = article.content.split("\n\n");

  return (
    <div className="min-h-screen bg-black pb-20">
      
      {/* Article Header Image Cover */}
      <div className="relative h-[40vh] sm:h-[50vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-4 lg:left-8 z-20">
          <Link href="/magazine" className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-gold hover:text-black rounded-full text-xs font-bold text-zinc-300 border border-white/10 hover:border-transparent transition-all backdrop-blur-md">
            <ArrowLeft size={14} /> 매거진 목록
          </Link>
        </div>
      </div>

      {/* Article Container */}
      <div className="max-w-[800px] mx-auto px-4 relative z-20 -mt-24 sm:-mt-32">
        <div className="glass rounded-3xl p-6 sm:p-10 border border-white/[0.06] bg-[#0E0E0E]/90 backdrop-blur-lg shadow-2xl">
          
          {/* Metadata */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-gold text-black tracking-wide uppercase">
              {article.badge}
            </span>
            <span className="text-[10px] font-bold text-zinc-500">
              {article.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-white/[0.05] pb-6 mb-8 font-bold">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Calendar size={13} /> {article.date}</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {article.readTime}</span>
              <span className="flex items-center gap-1"><Eye size={13} /> {article.views.toLocaleString()} 읽음</span>
            </div>
            <button className="flex items-center gap-1 text-zinc-400 hover:text-gold transition-colors">
              <Share2 size={13} /> 공유하기
            </button>
          </div>

          {/* Article Excerpt */}
          <div className="border-l-2 border-gold pl-4 py-1 mb-8">
            <p className="text-sm sm:text-base font-bold text-zinc-300 italic leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Article Body */}
          <div className="space-y-6 text-zinc-300 text-sm sm:text-[15px] leading-relaxed font-medium">
            {paragraphs.map((para, index) => (
              <p key={index} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>

          {/* 💡 Luxury-to-Rep Pipeline Call to Action Banner (핵심 목적 구현) */}
          <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 glow-gold relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-col items-start gap-4">
              <span className="text-[9px] font-black tracking-widest text-gold uppercase bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20">
                모두의렙 QC 연구소 추천
              </span>
              <h4 className="text-base sm:text-lg font-black text-white leading-relaxed">
                "내 자산은 안전하게 주식에 묶어두고,<br />
                필드컷 불가능한 1:1 최고 존엄 공장 제품의 QC 페이크포인트가 궁금하다면?"
              </h4>
              <p className="text-zinc-400 text-xs font-semibold leading-relaxed">
                실시간 세관 통관 동향부터 국내외 시계 장인들이 분석하는 디테일 싱크로율 분석 가이드까지 한눈에 확인하세요.
              </p>
              <Link 
                href="/qc" 
                className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-gold hover:bg-gold-light text-black font-black text-xs sm:text-sm rounded-full hover:shadow-lg hover:shadow-gold/25 transition-all duration-300"
              >
                모두의렙 QC 연구소 바로가기 <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

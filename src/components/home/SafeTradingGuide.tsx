"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Shield, Check, HelpCircle, AlertTriangle } from "lucide-react";

export function SafeTradingGuide() {
  // State for calculator checklist
  const [isTd, setIsTd] = useState(false);
  const [isGuarantee, setIsGuarantee] = useState(false);
  const [isHistoryChecked, setIsHistoryChecked] = useState(false);

  // Calculate safety score and rating
  const checkedCount = [isTd, isGuarantee, isHistoryChecked].filter(Boolean).length;
  let safetyScore = 10;
  let safetyStatus = "위험";
  let statusColor = "text-red-500 bg-red-500/10 border-red-500/20";
  let statusDesc = "사기 및 먹튀 위험이 매우 높습니다. 거래를 중단하고 조건을 다시 협의하세요.";
  let progressColor = "bg-red-500 shadow-red-500/50";

  if (checkedCount === 1) {
    safetyScore = 40;
    safetyStatus = "주의";
    statusColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    statusDesc = "안전 조건이 미흡합니다. 판매처 보장 조건이나 신용 이력을 더 검토해보세요.";
    progressColor = "bg-amber-500 shadow-amber-500/50";
  } else if (checkedCount === 2) {
    safetyScore = 75;
    safetyStatus = "보통";
    statusColor = "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    statusDesc = "대부분의 안전 요건을 충족했으나, 놓친 부분이 없는지 한번 더 꼼꼼히 점검하세요.";
    progressColor = "bg-yellow-400 shadow-yellow-400/50";
  } else if (checkedCount === 3) {
    safetyScore = 100;
    safetyStatus = "안전";
    statusColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    statusDesc = "모든 필수 안전 조건이 검증되었습니다. 비교적 안전하게 거래를 진행하실 수 있습니다.";
    progressColor = "bg-gradient-to-r from-gold to-yellow-500 shadow-gold/50";
  }

  const resetCalculator = () => {
    setIsTd(false);
    setIsGuarantee(false);
    setIsHistoryChecked(false);
  };

  return (
    <section className="glass rounded-xl p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-gold/[0.02] rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gold/[0.02] rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 border-b border-white/[0.06] pb-4">
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">안전 거래 안심 가이드</h2>
          <p className="text-xs text-zinc-400">모두의 렙이 지향하는 건강하고 투명한 안전 거래 가이드라인</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left: Core Rules Checklist */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gold flex items-center gap-1.5 mb-1">
            <Shield size={14} /> 필수 확인 거래 3대 원칙
          </h3>
          
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">1</span>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">검증된 공식 파트너(TD) 거래</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    커뮤니티의 검증 절차를 통과한 공식 제휴 셀러(Trusted Dealer)를 활용하여 먹튀 및 에스크로 미보장 사기 피해를 미연에 예방하세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">2</span>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">통관 실패 시 재배송/환불 조건 확인</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    배송 과정에서의 세관 압수(단속) 발생 시, 판매처에서 제공하는 100% 재배송 조건 또는 전액 환불 규정이 약관에 기재되어 있는지 확인해야 합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-gold/10 hover:bg-white/[0.03] transition-all group">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-black transition-colors">3</span>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">피싱/사칭 도메인 접속 차단</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    공식 커뮤니티 도메인 주소를 정확히 확인하고, 검색 노출되는 허위 사칭 사이트에 개인정보 및 로그인 비밀번호를 입력하지 않도록 유의하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Safety Score Calculator */}
        <div className="glass-card rounded-lg p-5 border border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-gold" /> 거래 안전 점수 자가 진단
            </h3>
            <button 
              onClick={resetCalculator}
              className="text-[10px] text-zinc-500 hover:text-gold transition-colors"
            >
              초기화
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">
            진행하시려는 거래 조건에 체크해보세요. 안전도 평점을 실시간 분석해 드립니다.
          </p>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <input
                type="checkbox"
                checked={isTd}
                onChange={(e) => setIsTd(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-gold focus:ring-gold"
              />
              <div>
                <p className="text-xs font-semibold text-white">공식 검증 셀러(TD)와의 거래입니까?</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">미등록 개인 셀러의 번개장터/오픈채팅 직거래는 지양하십시오.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <input
                type="checkbox"
                checked={isGuarantee}
                onChange={(e) => setIsGuarantee(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-gold focus:ring-gold"
              />
              <div>
                <p className="text-xs font-semibold text-white">통관 지연·폐기 보장 옵션이 있습니까?</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">세관 단속 시 재배송 또는 환불을 판매자가 약속했는지 확인합니다.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <input
                type="checkbox"
                checked={isHistoryChecked}
                onChange={(e) => setIsHistoryChecked(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-gold focus:ring-gold"
              />
              <div>
                <p className="text-xs font-semibold text-white">계좌·연락처의 사기 이력을 조회하셨습니까?</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">송금 전, 계좌가 더치트나 커뮤니티 사기 게시판에 조회되는지 확인합니다.</p>
              </div>
            </label>
          </div>

          {/* Calculator Results */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-zinc-400">자가 진단 안전 점수</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                {safetyStatus} ({safetyScore}점)
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
              <motion.div 
                className={`h-full ${progressColor}`}
                initial={{ width: "10%" }}
                animate={{ width: `${safetyScore}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
              />
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {statusDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080808] pb-24 lg:pb-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/logo-v2.png"
                alt="MODUREP 모두의 렙"
                width={260}
                height={102}
                className="h-[42px] sm:h-[52px] w-auto object-contain"
              />
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              QC · 후기 · 시세 · 공장정보<br />
              해외 커뮤니티 수준의 데이터를<br />
              한 곳에서 확인하세요.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">커뮤니티</h4>
            <ul className="space-y-2">
              {[
                { label: "QC 게시판", href: "/qc" },
                { label: "후기 게시판", href: "/community" },
                { label: "자유 게시판", href: "/community" },
                { label: "초보 게시판", href: "/community" },
              ].map((item) => (
                <li key={item.label}><Link href={item.href} className="text-sm text-zinc-500 hover:text-gold transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">정보</h4>
            <ul className="space-y-2">
              {[
                { label: "브랜드 목록", href: "/brands" },
                { label: "공장 랭킹", href: "/factories" },
                { label: "시세 차트", href: "/prices" },
                { label: "매거진", href: "/magazine" },
              ].map((item) => (
                <li key={item.label}><Link href={item.href} className="text-sm text-zinc-500 hover:text-gold transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">고객센터</h4>
            <ul className="space-y-2">
              {[
                { label: "이용약관", href: "#" },
                { label: "개인정보처리방침", href: "#" },
                { label: "구매 문의", href: "/shop" },
                { label: "제휴 문의", href: "#" },
              ].map((item) => (
                <li key={item.label}><Link href={item.href} className="text-sm text-zinc-500 hover:text-gold transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="section-divider mt-10" />
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">&copy; 2024 MODUREP. All rights reserved.</p>
          <p className="text-xs text-zinc-700">본 사이트는 정보 공유 목적으로 운영됩니다.</p>
        </div>
      </div>
    </footer>
  );
}

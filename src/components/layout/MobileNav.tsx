"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, PenLine, Users, User } from "lucide-react";

const MOBILE_NAV_ITEMS = [
  { label: "홈", icon: Home, href: "/" },
  { label: "QC", icon: Camera, href: "/qc" },
  { label: "글쓰기", icon: PenLine, href: "/community/write", isSpecial: true },
  { label: "커뮤니티", icon: Users, href: "/community" },
  { label: "MY", icon: User, href: "/mypage" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.06]">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center z-20 shrink-0"
              >
                {/* Floating Circular Gold Button */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark text-black flex items-center justify-center shadow-lg shadow-gold/30 border-4 border-[#0A0A0A] -translate-y-4 hover:scale-105 active:scale-95 transition-all duration-200">
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black text-gold -mt-3.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? "text-gold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? "bg-gold/10" : ""}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold" : ""}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

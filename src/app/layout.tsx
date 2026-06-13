import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "모두의 렙 MODUREP | 레플리카 시계·가방 정보 플랫폼",
  description:
    "QC · 후기 · 시세 · 공장정보 · 구매연결 — 해외 커뮤니티 수준의 데이터와 실제 사용자 경험을 한 곳에서 확인하세요.",
  keywords: "레플리카, 시계, 가방, QC, 후기, 공장, 시세, MODUREP, 모두의렙",
  openGraph: {
    title: "모두의 렙 MODUREP",
    description: "레플리카 시계·가방 정보 플랫폼",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        <Header />
        <main className="flex-1 pt-14 lg:pt-16 pb-16 lg:pb-0 overflow-x-hidden w-full">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}

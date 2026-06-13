"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Eye, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

const BRANDS = [
  {
    id: 1,
    name: "Rolex",
    nameKr: "롤렉스",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=300&fit=crop",
    models: 42,
    qcCount: 3241,
    rating: 4.8,
    popular: ["Submariner", "Daytona", "GMT Master II", "Datejust"],
    category: "시계",
  },
  {
    id: 2,
    name: "Omega",
    nameKr: "오메가",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
    models: 28,
    qcCount: 1892,
    rating: 4.6,
    popular: ["Seamaster", "Speedmaster", "Aqua Terra"],
    category: "시계",
  },
  {
    id: 3,
    name: "Audemars Piguet",
    nameKr: "오데마 피게",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=300&fit=crop",
    models: 15,
    qcCount: 1456,
    rating: 4.7,
    popular: ["Royal Oak", "Royal Oak Offshore"],
    category: "시계",
  },
  {
    id: 4,
    name: "Cartier",
    nameKr: "까르띠에",
    image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400&h=300&fit=crop",
    models: 18,
    qcCount: 1123,
    rating: 4.5,
    popular: ["Tank", "Santos", "Ballon Bleu"],
    category: "시계",
  },
  {
    id: 5,
    name: "Chanel",
    nameKr: "샤넬",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
    models: 22,
    qcCount: 2134,
    rating: 4.6,
    popular: ["Classic Flap", "Boy", "19", "Gabrielle"],
    category: "가방",
  },
  {
    id: 6,
    name: "Louis Vuitton",
    nameKr: "루이비통",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop",
    models: 35,
    qcCount: 1876,
    rating: 4.5,
    popular: ["Speedy", "Neverfull", "Alma", "Pochette"],
    category: "가방",
  },
  {
    id: 7,
    name: "Patek Philippe",
    nameKr: "파텍 필립",
    image: "https://images.unsplash.com/photo-1509941943102-10c232fc1571?w=400&h=300&fit=crop",
    models: 12,
    qcCount: 892,
    rating: 4.7,
    popular: ["Nautilus", "Aquanaut", "Calatrava"],
    category: "시계",
  },
  {
    id: 8,
    name: "Hermès",
    nameKr: "에르메스",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    models: 16,
    qcCount: 743,
    rating: 4.4,
    popular: ["Birkin", "Kelly", "Constance", "Lindy"],
    category: "가방",
  },
];

const CATEGORIES = ["전체", "시계", "가방"];

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");

  const filtered = BRANDS.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.nameKr.includes(search);
    const matchCategory = category === "전체" || b.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="mb-6 border-b border-white/[0.05] pb-4">
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">브랜드 목록</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-bold">인기 브랜드별 모델 정보와 QC 데이터를 확인하세요.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-white/[0.04] pb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="브랜드 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-[#111111] border border-white/[0.08] rounded-xl text-[11px] placeholder:text-zinc-600 focus:outline-none focus:border-gold/30 transition-colors font-medium text-white"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-200 ${
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
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/brands/${brand.id}`} className="block glass rounded-xl overflow-hidden card-hover group">
                <div className="relative h-40 overflow-hidden">
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-lg font-black text-white group-hover:text-gold transition-colors">{brand.name}</p>
                    <p className="text-xs text-zinc-400 font-bold">{brand.nameKr}</p>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold font-semibold">{brand.category}</span>
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                    <span className="flex items-center gap-1"><Eye size={11} /> QC {brand.qcCount.toLocaleString()}건</span>
                    <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400" fill="currentColor" /> {brand.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {brand.popular.slice(0, 3).map((model) => (
                      <span key={model} className="text-[10px] px-2 py-0.5 bg-white/[0.04] rounded-full text-zinc-500">{model}</span>
                    ))}
                    {brand.popular.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 bg-white/[0.04] rounded-full text-zinc-500">+{brand.popular.length - 3}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                    <span className="text-[11px] text-zinc-500">{brand.models}개 모델</span>
                    <ChevronRight size={14} className="text-zinc-600 group-hover:text-gold transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { HeroSection } from "@/components/home/HeroSection";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { FactoryDetailMatrix } from "@/components/home/FactoryDetailMatrix";
import { RecentReviews } from "@/components/home/RecentReviews";
import { FactoryRanking } from "@/components/home/FactoryRanking";
import { PriceTrends } from "@/components/home/PriceTrends";
import { SafeTradingGuide } from "@/components/home/SafeTradingGuide";
import { LiveActivity } from "@/components/home/LiveActivity";
import { QuickMenu } from "@/components/home/QuickMenu";
import { MagazineSection } from "@/components/home/MagazineSection";
import { PurchaseCTA } from "@/components/home/PurchaseCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-12">
        {/* Hero */}
        <HeroSection />

        {/* New 3-Column Dashboard */}
        <HomeDashboard />

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Left: Main content */}
          <div className="space-y-8">
            {/* Factory Specialty Matrix */}
            <FactoryDetailMatrix />

            {/* 3-column section: Reviews, Factory, Trends */}
            <div className="grid md:grid-cols-3 gap-3">
              <RecentReviews />
              <FactoryRanking />
              <PriceTrends />
            </div>

            {/* Safe Trading Guide & Calculator */}
            <SafeTradingGuide />

            {/* Magazine */}
            <MagazineSection />
          </div>

          {/* Right: Sidebar */}
          <aside className="hidden lg:block space-y-4">
            <LiveActivity />
            <QuickMenu />
            <PurchaseCTA />
          </aside>
        </div>

        {/* Mobile: Purchase CTA (visible below lg) */}
        <div className="lg:hidden mt-8">
          <PurchaseCTA />
        </div>
      </div>
    </div>
  );
}

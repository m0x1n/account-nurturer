import { BarChart3, Gift, Megaphone, Share2, Target } from "lucide-react";
import { MarketingCard } from "@/components/marketing/MarketingCard";
import { MarketingSection } from "@/components/marketing/MarketingSection";

export default function Marketing() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <Megaphone className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          Marketing
        </h1>
      </div>

      {/* Marketing Overview Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Marketing Overview</h2>
        <MarketingSection>
          <MarketingCard
            icon={Target}
            title="Engage"
            description="Connect with your customers through personalized campaigns"
            features={[
              "Create targeted email campaigns",
              "Send personalized SMS messages",
              "Schedule automated follow-ups"
            ]}
          />
          <MarketingCard
            icon={Gift}
            title="Promote"
            description="Create and manage special offers and promotions"
            features={[
              "Design special offers and discounts",
              "Create loyalty programs",
              "Track promotion performance"
            ]}
          />
          <MarketingCard
            icon={BarChart3}
            title="Analyze"
            description="Track the performance of your marketing efforts"
            features={[
              "Monitor campaign metrics",
              "Track customer engagement",
              "Measure ROI on promotions"
            ]}
          />
          <MarketingCard
            icon={Share2}
            title="Share"
            description="Spread the word about your business on social media"
            features={[
              "Share updates on social media",
              "Create engaging content",
              "Build your online presence"
            ]}
          />
        </MarketingSection>
      </div>
    </div>
  );
}
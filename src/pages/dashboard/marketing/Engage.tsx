import { Target, Zap, PenTool } from "lucide-react";
import { MarketingCard } from "@/components/marketing/MarketingCard";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { useNavigate } from "react-router-dom";

export default function Engage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          Engage
        </h1>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Choose Your Campaign Type</h2>
        <MarketingSection>
          <div onClick={() => navigate('smart')} className="cursor-pointer">
            <MarketingCard
              icon={Zap}
              title="Smart Campaigns"
              description="Let AI help you create and optimize your campaigns"
              features={[
                "Automated campaign optimization",
                "AI-powered audience targeting",
                "Smart scheduling",
                "Coming soon..."
              ]}
            />
          </div>
          <div onClick={() => navigate('manual')} className="cursor-pointer">
            <MarketingCard
              icon={PenTool}
              title="Create Manual Campaign"
              description="Design and control every aspect of your campaign"
              features={[
                "Full creative control",
                "Custom scheduling",
                "Detailed targeting options",
                "Performance tracking"
              ]}
            />
          </div>
        </MarketingSection>
      </div>
    </div>
  );
}
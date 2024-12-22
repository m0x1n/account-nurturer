import { Mail, MessageSquare, Star, Gift, Smartphone, HeadphonesIcon, MousePointerClick, Share2, Globe, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketingCard } from "@/components/marketing/MarketingCard";
import { MarketingSection } from "@/components/marketing/MarketingSection";

export default function Marketing() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">Marketing</h1>
      </div>

      <Tabs defaultValue="communication" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto gap-4 bg-transparent">
          <TabsTrigger value="communication" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Communication
          </TabsTrigger>
          <TabsTrigger value="promotions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Promotions
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="digital" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Digital Presence
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communication" className="space-y-4">
          <MarketingSection>
            <MarketingCard
              icon={Mail}
              title="Email & SMS Marketing"
              description="Automated messaging campaigns and templates"
              features={[
                "Appointment reminders",
                "Promotional campaigns",
                "Loyalty updates",
                "Drip campaigns"
              ]}
            />
            <MarketingCard
              icon={MessageSquare}
              title="In-App Chat & Support"
              description="Direct communication channels with clients"
              features={[
                "Client-to-business chat",
                "Automated FAQs",
                "Chatbot support",
                "Quick responses"
              ]}
            />
          </MarketingSection>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <MarketingSection>
            <MarketingCard
              icon={Gift}
              title="Promotions & Discounts"
              description="Create and manage special offers"
              features={[
                "Seasonal offers",
                "Referral discounts",
                "Success tracking",
                "Custom campaigns"
              ]}
            />
            <MarketingCard
              icon={Star}
              title="Membership & Loyalty"
              description="Reward your regular customers"
              features={[
                "Subscription memberships",
                "Points system",
                "Redemption options",
                "Member perks"
              ]}
            />
          </MarketingSection>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <MarketingSection>
            <MarketingCard
              icon={Star}
              title="Client Reviews"
              description="Manage and boost your online reputation"
              features={[
                "Automated review requests",
                "Google integration",
                "Yelp integration",
                "Social media presence"
              ]}
            />
            <MarketingCard
              icon={Smartphone}
              title="Branded App"
              description="Custom mobile experience for your clients"
              features={[
                "White-label solution",
                "Integrated booking",
                "Push notifications",
                "Loyalty integration"
              ]}
            />
          </MarketingSection>
        </TabsContent>

        <TabsContent value="digital" className="space-y-4">
          <MarketingSection>
            <MarketingCard
              icon={MousePointerClick}
              title="Ad Campaigns"
              description="Reach new customers effectively"
              features={[
                "Local targeting",
                "Performance tracking",
                "ROI analytics",
                "Campaign optimization"
              ]}
            />
            <MarketingCard
              icon={Share2}
              title="Social Media"
              description="Manage your social presence"
              features={[
                "Post scheduling",
                "Content suggestions",
                "Engagement tracking",
                "Trend analysis"
              ]}
            />
            <MarketingCard
              icon={Globe}
              title="Website & SEO"
              description="Optimize your online presence"
              features={[
                "SEO optimization",
                "Website builder",
                "Traffic analytics",
                "Conversion tracking"
              ]}
            />
          </MarketingSection>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <MarketingSection>
            <MarketingCard
              icon={BarChart3}
              title="Marketing Analytics"
              description="Track and optimize your marketing efforts"
              features={[
                "Client retention rates",
                "Marketing ROI",
                "Campaign performance",
                "Demographic insights"
              ]}
            />
          </MarketingSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { Mail, MessageSquare, Star, Gift, Smartphone, HeadphonesIcon, MousePointerClick, Share2, Globe, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketingCard } from "@/components/marketing/MarketingCard";
import { MarketingSection } from "@/components/marketing/MarketingSection";
import { EmailMarketing } from "@/components/marketing/EmailMarketing";
import { SMSMarketing } from "@/components/marketing/SMSMarketing";

export default function Marketing() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          Marketing
        </h1>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto gap-4 bg-transparent">
          <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Email Marketing
          </TabsTrigger>
          <TabsTrigger value="sms" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            SMS Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <EmailMarketing />
        </TabsContent>

        <TabsContent value="sms">
          <SMSMarketing />
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from "react";
import { 
  Rocket, 
  Calendar, 
  Clock, 
  Timer, 
  Bell, 
  UserMinus 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BoostCampaignConfig } from "@/components/marketing/campaigns/BoostCampaignConfig";

interface Campaign {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isComingSoon?: boolean;
}

export default function SmartCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "boost",
      name: "Boost Campaigns",
      description: "Increase bookings during specific periods with targeted promotions",
      icon: <Rocket className="h-6 w-6" />,
      isActive: false
    },
    {
      id: "last-minute",
      name: "Fill Last Minute Openings",
      description: "Automatically promote available slots within 24-48 hours",
      icon: <Clock className="h-6 w-6" />,
      isActive: false,
      isComingSoon: true
    },
    {
      id: "slow-days",
      name: "Fill Slow Days",
      description: "Target traditionally slower business days with special offers",
      icon: <Calendar className="h-6 w-6" />,
      isActive: false,
      isComingSoon: true
    },
    {
      id: "limited-time",
      name: "Limited Time Specials",
      description: "Create urgency with time-sensitive promotional offers",
      icon: <Timer className="h-6 w-6" />,
      isActive: false,
      isComingSoon: true
    },
    {
      id: "reminder",
      name: "Reminder to Book Again",
      description: "Automatically remind clients when it's time for their next appointment",
      icon: <Bell className="h-6 w-6" />,
      isActive: false,
      isComingSoon: true
    },
    {
      id: "rescue",
      name: "Rescue Lost Customers",
      description: "Re-engage clients who haven't booked in a while",
      icon: <UserMinus className="h-6 w-6" />,
      isActive: false,
      isComingSoon: true
    }
  ]);

  const [configureId, setConfigureId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setCampaigns(prevCampaigns =>
      prevCampaigns.map(campaign =>
        campaign.id === id
          ? { ...campaign, isActive: !campaign.isActive }
          : campaign
      )
    );
  };

  const handleConfigure = (id: string) => {
    setConfigureId(id);
  };

  const handleCloseConfig = () => {
    setConfigureId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Rocket className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold">
          Smart Campaigns
        </h1>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="p-4 bg-card rounded-lg border shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-primary">
                  {campaign.icon}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{campaign.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {campaign.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {!campaign.isComingSoon && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigure(campaign.id)}
                  >
                    Configure
                  </Button>
                )}
                {campaign.isComingSoon ? (
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                ) : (
                  <Switch
                    checked={campaign.isActive}
                    onCheckedChange={() => handleToggle(campaign.id)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {configureId === "boost" && (
        <BoostCampaignConfig
          isOpen={true}
          onClose={handleCloseConfig}
        />
      )}
    </div>
  );
}
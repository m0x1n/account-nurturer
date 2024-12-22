import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BoostCampaignConfig } from "@/components/marketing/campaigns/BoostCampaignConfig";

interface CampaignToggle {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const EmailMarketing = () => {
  const { toast } = useToast();
  const [configureBoost, setConfigureBoost] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignToggle[]>([
    {
      id: "boost",
      name: "Boost Campaigns",
      description: "Promote special offers and events to increase bookings",
      isActive: false,
    },
    {
      id: "last-minute",
      name: "Fill Last Minute Openings",
      description: "Automatically notify clients about last-minute availability",
      isActive: false,
    },
    {
      id: "slow-days",
      name: "Fill Slow Days",
      description: "Send promotions during typically slow business periods",
      isActive: false,
    },
    {
      id: "specials",
      name: "Limited Time Specials",
      description: "Create urgency with time-sensitive offers",
      isActive: false,
    },
    {
      id: "reminder",
      name: "Reminder to Book Again",
      description: "Remind clients when it's time for their next appointment",
      isActive: false,
    },
    {
      id: "rescue",
      name: "Rescue Lost Customers",
      description: "Re-engage customers who haven't visited in a while",
      isActive: false,
    },
  ]);

  const handleToggle = async (id: string) => {
    try {
      const campaign = campaigns.find((c) => c.id === id);
      if (!campaign) return;

      if (id === "boost" && !campaign.isActive) {
        setConfigureBoost(true);
        return;
      }

      const updatedCampaigns = campaigns.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      );

      const { error } = await supabase
        .from("marketing_campaigns")
        .upsert({
          campaign_type: "email",
          name: campaign.name,
          is_active: !campaign.isActive,
          settings: { description: campaign.description },
        });

      if (error) throw error;

      setCampaigns(updatedCampaigns);
      toast({
        title: `${campaign.name} ${!campaign.isActive ? "enabled" : "disabled"}`,
        description: `Email campaign has been ${
          !campaign.isActive ? "activated" : "deactivated"
        }`,
      });
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  const handleConfigure = (id: string) => {
    if (id === "boost") {
      setConfigureBoost(true);
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: "Campaign configuration will be available soon",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Marketing</h1>
        <Button variant="outline" onClick={() => handleConfigure("custom")}>
          Create Custom Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="space-y-1">
              <h3 className="font-medium">{campaign.name}</h3>
              <p className="text-sm text-gray-500">{campaign.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfigure(campaign.id)}
              >
                Configure
              </Button>
              <Switch
                checked={campaign.isActive}
                onCheckedChange={() => handleToggle(campaign.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <BoostCampaignConfig
        isOpen={configureBoost}
        onClose={() => setConfigureBoost(false)}
      />
    </div>
  );
};

export default EmailMarketing;
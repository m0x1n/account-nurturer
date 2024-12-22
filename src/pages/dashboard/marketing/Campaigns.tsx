import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BoostCampaignConfig } from "@/components/marketing/campaigns/BoostCampaignConfig";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Campaign {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "boost",
      name: "Boost Campaigns",
      description: "Promote special offers and events",
      isActive: false,
    },
    {
      id: "last-minute",
      name: "Fill Last Minute Openings",
      description: "Automatically notify clients about available slots",
      isActive: false,
    },
    {
      id: "slow-days",
      name: "Fill Slow Days",
      description: "Increase bookings during quiet periods",
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
      description: "Re-engage clients who haven't booked recently",
      isActive: false,
    },
    {
      id: "rescue",
      name: "Rescue Lost Customers",
      description: "Win back customers who haven't returned",
      isActive: false,
    },
  ]);

  const handleToggle = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, isActive: !campaign.isActive } 
        : campaign
    ));
    setSelectedCampaign(campaignId);
    if (campaignId === "boost") {
      setIsConfigOpen(true);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold">Smart Campaigns</h1>
        <Button variant="secondary">Manual Campaign</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className={`p-4 rounded-lg border bg-card ${
                selectedCampaign === campaign.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCampaign(campaign.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-medium">{campaign.name}</Label>
                <Switch
                  checked={campaign.isActive}
                  onCheckedChange={() => handleToggle(campaign.id)}
                />
              </div>
              <p className="text-sm text-muted-foreground">{campaign.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg border p-4">
          {selectedCampaign === "boost" && (
            <BoostCampaignConfig 
              isOpen={isConfigOpen} 
              onClose={() => setIsConfigOpen(false)} 
            />
          )}
          {selectedCampaign && selectedCampaign !== "boost" && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Configuration options coming soon
            </div>
          )}
          {!selectedCampaign && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a campaign to configure
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
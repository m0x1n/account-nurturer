import { useState } from "react";
import { Mail, Settings } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessData } from "@/hooks/useBusinessData";

interface CampaignToggleProps {
  name: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  onConfigure: () => void;
}

const CampaignToggle = ({ name, description, isActive, onToggle, onConfigure }: CampaignToggleProps) => (
  <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
    <div className="space-y-1">
      <h3 className="font-medium">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onConfigure}>
        <Settings className="h-4 w-4 mr-1" />
        Configure
      </Button>
      <Toggle
        pressed={isActive}
        onPressedChange={onToggle}
        className="data-[state=on]:bg-primary"
      />
    </div>
  </div>
);

export function EmailMarketing() {
  const { data: business } = useBusinessData();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState([
    {
      name: "Boost Campaigns",
      description: "Promote special offers and events",
      isActive: false,
    },
    {
      name: "Fill Last Minute Openings",
      description: "Automatically notify clients about available slots",
      isActive: false,
    },
    {
      name: "Fill Slow Days",
      description: "Increase bookings during quiet periods",
      isActive: false,
    },
    {
      name: "Limited Time Specials",
      description: "Create urgency with time-sensitive offers",
      isActive: false,
    },
    {
      name: "Reminder to Book Again",
      description: "Re-engage clients who haven't booked recently",
      isActive: false,
    },
    {
      name: "Rescue Lost Customers",
      description: "Win back customers who haven't returned",
      isActive: false,
    },
  ]);

  const handleToggle = async (index: number) => {
    if (!business?.id) return;

    const campaign = campaigns[index];
    const newCampaigns = [...campaigns];
    newCampaigns[index] = { ...campaign, isActive: !campaign.isActive };

    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .upsert({
          business_id: business.id,
          campaign_type: 'email',
          name: campaign.name,
          is_active: !campaign.isActive,
        });

      if (error) throw error;

      setCampaigns(newCampaigns);
      toast({
        title: campaign.isActive ? "Campaign paused" : "Campaign activated",
        description: `${campaign.name} has been ${campaign.isActive ? 'paused' : 'activated'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status.",
        variant: "destructive",
      });
    }
  };

  const handleConfigure = (index: number) => {
    // Configuration modal will be implemented later
    toast({
      title: "Coming Soon",
      description: "Campaign configuration will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Email Campaigns</h2>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign, index) => (
          <CampaignToggle
            key={campaign.name}
            {...campaign}
            onToggle={() => handleToggle(index)}
            onConfigure={() => handleConfigure(index)}
          />
        ))}
      </div>

      <div className="mt-8">
        <Button variant="outline" className="w-full">
          Create One-off Campaign
        </Button>
      </div>
    </div>
  );
}
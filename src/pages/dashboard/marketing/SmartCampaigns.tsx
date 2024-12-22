import { useState, useEffect } from "react";
import { 
  Zap,
  Rocket,
  Calendar, 
  Clock, 
  Timer, 
  Bell, 
  UserMinus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { BoostCampaignConfig } from "@/components/marketing/campaigns/BoostCampaignConfig";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAfter } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isDisabled?: boolean;
  isComingSoon?: boolean;
}

export default function SmartCampaigns() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "boost",
      name: "Boost",
      description: "Increase bookings during specific periods with targeted promotions",
      icon: <Rocket className="h-6 w-6" />,
      isActive: false,
      isDisabled: false
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

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Check for active boost campaign on mount
  useEffect(() => {
    checkActiveBoostCampaign();
  }, []);

  const checkActiveBoostCampaign = async () => {
    try {
      const { data: activeBoost } = await supabase
        .from('marketing_campaigns')
        .select('*, settings')
        .eq('campaign_type', 'boost')
        .eq('is_active', true)
        .is('archived_at', null)
        .single();

      if (activeBoost) {
        const settings = activeBoost.settings as any;
        const scheduledDays = settings?.schedule || [];
        const lastDay = scheduledDays[scheduledDays.length - 1]?.date;
        
        // Check if the campaign is still valid (last day hasn't passed)
        const isStillValid = lastDay && isAfter(new Date(lastDay), new Date());

        setCampaigns(prevCampaigns =>
          prevCampaigns.map(campaign =>
            campaign.id === "boost"
              ? { 
                  ...campaign, 
                  isActive: isStillValid,
                  isDisabled: isStillValid 
                }
              : campaign
          )
        );
      }
    } catch (error) {
      console.error('Error checking active boost campaign:', error);
    }
  };

  const handleToggle = async (id: string) => {
    if (id === "boost") {
      // For boost campaign, we'll let the BoostCampaignConfig handle the toggle
      // through its onSaveSuccess callback
      setExpandedId(id);
    } else {
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(campaign =>
          campaign.id === id && !campaign.isDisabled
            ? { ...campaign, isActive: !campaign.isActive }
            : campaign
        )
      );
    }
  };

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleBoostSaveSuccess = (isActive: boolean) => {
    setCampaigns(prevCampaigns =>
      prevCampaigns.map(campaign =>
        campaign.id === "boost"
          ? { ...campaign, isActive, isDisabled: isActive }
          : campaign
      )
    );
    
    // Close the configuration panel
    setExpandedId(null);

    // Show success message
    toast({
      title: isActive ? "Boost Campaign Activated" : "Boost Campaign Saved",
      description: isActive 
        ? "Your boost campaign is now running" 
        : "Your boost campaign has been saved",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold">
          Smart Campaigns
        </h1>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="space-y-4">
            <div className="p-4 bg-card rounded-lg border shadow-sm">
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
                    <button
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                      onClick={() => handleExpand(campaign.id)}
                    >
                      Configure
                      {expandedId === campaign.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  {campaign.isComingSoon ? (
                    <span className="text-sm text-muted-foreground">Coming Soon</span>
                  ) : (
                    <Switch
                      checked={campaign.isActive}
                      onCheckedChange={() => handleToggle(campaign.id)}
                      disabled={campaign.isDisabled}
                    />
                  )}
                </div>
              </div>
            </div>
            {expandedId === campaign.id && campaign.id === "boost" && (
              <div className="pl-10 pr-4 pb-4">
                <BoostCampaignConfig 
                  isOpen={expandedId === campaign.id} 
                  onClose={() => setExpandedId(null)}
                  onSaveSuccess={handleBoostSaveSuccess}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
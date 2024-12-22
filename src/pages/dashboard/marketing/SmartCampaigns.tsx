import { 
  Zap,
  Rocket,
  Calendar, 
  Clock, 
  Timer, 
  Bell, 
  UserMinus,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BoostCampaignConfig } from "@/components/marketing/campaigns/BoostCampaignConfig";
import { LastMinuteCampaignConfig } from "@/components/marketing/campaigns/LastMinuteCampaignConfig";
import { CampaignCard } from "@/components/marketing/smart-campaigns/CampaignCard";
import { useCampaigns } from "@/components/marketing/smart-campaigns/useCampaigns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const INITIAL_CAMPAIGNS = [
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
    isComingSoon: false
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
];

export default function SmartCampaigns() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    campaigns,
    setCampaigns,
    expandedId,
    setExpandedId,
    handleExpand,
  } = useCampaigns(INITIAL_CAMPAIGNS);

  const handleNavigateUp = () => {
    navigate('/dashboard/marketing/engage');
  };

  const handleBoostSaveSuccess = (isActive: boolean) => {
    setCampaigns(prevCampaigns =>
      prevCampaigns.map(campaign =>
        campaign.id === "boost"
          ? { ...campaign, isActive, isDisabled: isActive }
          : campaign
      )
    );
    
    setExpandedId(null);

    toast({
      title: isActive ? "Boost Campaign Activated" : "Boost Campaign Saved",
      description: isActive 
        ? "Your boost campaign is now running" 
        : "Your boost campaign has been saved",
    });
  };

  const handleLastMinuteSaveSuccess = (isActive: boolean) => {
    setCampaigns(prevCampaigns =>
      prevCampaigns.map(campaign =>
        campaign.id === "last-minute"
          ? { ...campaign, isActive, isDisabled: isActive }
          : campaign
      )
    );
    
    setExpandedId(null);

    toast({
      title: isActive ? "Last Minute Campaign Activated" : "Last Minute Campaign Saved",
      description: isActive 
        ? "Your last minute campaign is now running" 
        : "Your last minute campaign has been saved",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-serif font-bold">
            Smart Campaigns
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNavigateUp}
          className="flex items-center gap-2"
        >
          <ChevronUp className="h-4 w-4" />
          <span>Back to Engage</span>
        </Button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="space-y-4">
            <CampaignCard
              {...campaign}
              expandedId={expandedId}
              onExpand={handleExpand}
            />
            {expandedId === campaign.id && campaign.id === "boost" && (
              <div className="pl-10 pr-4 pb-4">
                <BoostCampaignConfig 
                  isOpen={expandedId === campaign.id} 
                  onClose={() => setExpandedId(null)}
                  onSaveSuccess={handleBoostSaveSuccess}
                />
              </div>
            )}
            {expandedId === campaign.id && campaign.id === "last-minute" && (
              <div className="pl-10 pr-4 pb-4">
                <LastMinuteCampaignConfig 
                  isOpen={expandedId === campaign.id} 
                  onClose={() => setExpandedId(null)}
                  onSaveSuccess={handleLastMinuteSaveSuccess}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
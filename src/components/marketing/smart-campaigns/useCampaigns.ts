import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAfter } from "date-fns";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isDisabled?: boolean;
  isComingSoon?: boolean;
}

export function useCampaigns(initialCampaigns: Campaign[]) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    checkActiveBoostCampaign();
  }, []);

  const checkActiveBoostCampaign = async () => {
    try {
      const { data: activeBoost, error } = await supabase
        .from('marketing_campaigns')
        .select('*, settings')
        .eq('campaign_type', 'boost')
        .eq('is_active', true)
        .is('archived_at', null)
        .maybeSingle();

      if (error) {
        console.error('Error checking active boost campaign:', error);
        return;
      }

      if (activeBoost) {
        const settings = activeBoost.settings as any;
        const scheduledDays = settings?.schedule || [];
        const lastDay = scheduledDays[scheduledDays.length - 1]?.date;
        
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

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return {
    campaigns,
    setCampaigns,
    expandedId,
    setExpandedId,
    handleExpand,
  };
}
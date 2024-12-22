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
    checkActiveCampaigns();
  }, []);

  const checkActiveCampaigns = async () => {
    try {
      const { data: activeCampaigns, error } = await supabase
        .from('marketing_campaigns')
        .select('campaign_type, status, settings')
        .eq('status', 'active')
        .is('archived_at', null);

      if (error) {
        console.error('Error checking active campaigns:', error);
        return;
      }

      if (activeCampaigns) {
        setCampaigns(prevCampaigns =>
          prevCampaigns.map(campaign => {
            const activeCampaign = activeCampaigns.find(
              ac => ac.campaign_type.toLowerCase() === campaign.id
            );

            if (activeCampaign) {
              const settings = activeCampaign.settings as any;
              const scheduledDays = settings?.schedule || [];
              const lastDay = scheduledDays[scheduledDays.length - 1]?.date;
              const isStillValid = lastDay ? isAfter(new Date(lastDay), new Date()) : true;

              return {
                ...campaign,
                isActive: isStillValid,
                isDisabled: isStillValid
              };
            }
            return campaign;
          })
        );
      }
    } catch (error) {
      console.error('Error checking active campaigns:', error);
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
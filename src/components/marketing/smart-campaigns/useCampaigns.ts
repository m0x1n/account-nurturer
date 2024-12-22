import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        .select('campaign_type, status, settings, is_active')
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

            // A campaign is active if it exists, is marked as active, and has 'active' status
            const isActive = !!activeCampaign && 
              activeCampaign.is_active && 
              activeCampaign.status === 'active';

            return {
              ...campaign,
              isActive,
              isDisabled: isActive // Disable configuration if campaign is active
            };
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
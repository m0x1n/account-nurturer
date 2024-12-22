import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign, CampaignSubtype } from "../types/campaignTypes";

// Helper function to ensure campaign subtype is valid
const validateCampaignSubtype = (subtype: string | null): CampaignSubtype => {
  const validSubtypes: CampaignSubtype[] = ['boost', 'last-minute', 'slow-days', 'limited-time', 'reminder', 'rescue', 'manual'];
  return (subtype && validSubtypes.includes(subtype as CampaignSubtype)) 
    ? (subtype as CampaignSubtype) 
    : 'manual';
};

export function useCampaignsQuery() {
  const queryClient = useQueryClient();

  return {
    ...useQuery({
      queryKey: ['campaigns-with-metrics'],
      queryFn: async () => {
        const { data: campaigns, error } = await supabase
          .from('marketing_campaigns')
          .select(`
            *,
            campaign_metrics (
              users_targeted,
              users_engaged,
              users_opened,
              users_clicked,
              users_unsubscribed,
              percent_opened,
              percent_clicked,
              percent_unsubscribed
            )
          `)
          .is('archived_at', null)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Parse the settings JSON and validate campaign subtype for each campaign
        return campaigns.map((campaign): Campaign => ({
          ...campaign,
          campaign_subtype: validateCampaignSubtype(campaign.campaign_subtype),
          settings: campaign.settings as Campaign['settings']
        }));
      },
    }),
    invalidate: () => queryClient.invalidateQueries({ queryKey: ['campaigns-with-metrics'] })
  };
}
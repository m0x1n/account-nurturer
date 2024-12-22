import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCampaignsQuery() {
  return useQuery({
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
        `);

      if (error) throw error;
      return campaigns;
    },
  });
}
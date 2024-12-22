import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
          .is('archived_at', null);

        if (error) throw error;
        return campaigns;
      },
    }),
    invalidate: () => queryClient.invalidateQueries({ queryKey: ['campaigns-with-metrics'] })
  };
}
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";

export const useAudienceCalculation = (business: any) => {
  const calculateTargetAudience = async (targetingOption: string, daysThreshold: string) => {
    if (!business?.id) return 0;

    if (targetingOption === 'all') {
      const { count } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id);
      
      return count || 0;
    } else {
      const thresholdDate = subDays(new Date(), parseInt(daysThreshold));
      
      const { data: appointments } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('business_id', business.id)
        .eq('status', 'completed')
        .gte('start_time', thresholdDate.toISOString())
        .lt('start_time', new Date().toISOString());

      const { data: futureAppointments } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('business_id', business.id)
        .gte('start_time', new Date().toISOString());

      const excludedClientIds = new Set([
        ...(appointments?.map(a => a.client_id) || []),
        ...(futureAppointments?.map(a => a.client_id) || [])
      ]);

      const { count } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .not('id', 'in', `(${Array.from(excludedClientIds).join(',')})`);

      return count || 0;
    }
  };

  return { calculateTargetAudience };
};
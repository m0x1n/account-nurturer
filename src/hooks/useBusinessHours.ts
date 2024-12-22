import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessHours = (businessId?: string) => {
  return useQuery({
    queryKey: ["business-hours", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data } = await supabase
        .from("business_hours")
        .select("*")
        .eq("business_id", businessId);
      return data || [];
    },
    enabled: !!businessId,
  });
};
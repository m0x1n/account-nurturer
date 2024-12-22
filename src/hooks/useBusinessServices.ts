import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessServices = (businessId?: string) => {
  return useQuery({
    queryKey: ["services", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", businessId);
      return data || [];
    },
    enabled: !!businessId,
  });
};
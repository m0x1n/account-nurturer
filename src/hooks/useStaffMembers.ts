import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStaffMembers = (businessId?: string) => {
  return useQuery({
    queryKey: ["staff", businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const { data } = await supabase
        .from("staff_members")
        .select("*")
        .eq("business_id", businessId);
      return data || [];
    },
    enabled: !!businessId,
  });
};
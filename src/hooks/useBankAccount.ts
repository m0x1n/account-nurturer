import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBankAccount = (businessId?: string) => {
  return useQuery({
    queryKey: ["bank-account", businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const { data } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("business_id", businessId)
        .maybeSingle();
      return data;
    },
    enabled: !!businessId,
  });
};
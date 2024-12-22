import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBookingLink = (businessId?: string) => {
  return useQuery({
    queryKey: ["booking-link", businessId],
    queryFn: async () => {
      if (!businessId) return null;
      const { data } = await supabase
        .from("booking_links")
        .select("*")
        .eq("business_id", businessId)
        .maybeSingle();
      return data;
    },
    enabled: !!businessId,
  });
};
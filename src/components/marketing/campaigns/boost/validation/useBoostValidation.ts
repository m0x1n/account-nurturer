import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useBoostValidation = (business: any) => {
  const { toast } = useToast();

  const checkExistingBoostCampaign = async () => {
    const { data: existingCampaigns, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .eq("business_id", business?.id)
      .eq("campaign_subtype", "boost")
      .eq("is_active", true)
      .is("archived_at", null);

    if (error) {
      console.error("Error checking existing campaigns:", error);
      return true; // Return true to prevent save on error
    }

    return existingCampaigns && existingCampaigns.length > 0;
  };

  const validateBusinessData = () => {
    if (!business?.id) {
      toast({
        title: "Error",
        description: "Business data not available",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    checkExistingBoostCampaign,
    validateBusinessData,
  };
};
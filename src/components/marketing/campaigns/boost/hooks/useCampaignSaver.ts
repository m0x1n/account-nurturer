import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BoostSettings } from "../../types/campaignSettings";
import { useBoostValidation } from "../validation/useBoostValidation";
import { useAudienceCalculation } from "../audience/useAudienceCalculation";

export const useCampaignSaver = (
  business: any,
  onClose: () => void,
  onSaveSuccess?: (isActive: boolean) => void
) => {
  const { toast } = useToast();
  const { checkExistingBoostCampaign, validateBusinessData } = useBoostValidation(business);
  const { calculateTargetAudience } = useAudienceCalculation(business);

  const handleSave = async (
    campaignName: string,
    targetingOption: string,
    daysThreshold: string,
    discountType: string,
    discountValue: string,
    applyToAllServices: boolean,
    selectedServices: string[],
    scheduledDays: any[],
    isBoostStillValid: () => boolean
  ) => {
    if (!validateBusinessData()) return;

    const hasActiveBoostCampaign = await checkExistingBoostCampaign();
    if (hasActiveBoostCampaign) {
      toast({
        title: "Error",
        description: "An active Boost campaign already exists. Please archive it before creating a new one.",
        variant: "destructive",
      });
      return;
    }

    try {
      const targetAudienceSize = await calculateTargetAudience(targetingOption, daysThreshold);

      const enabledDays = scheduledDays.filter(day => day.enabled);
      const startDate = enabledDays.length > 0 ? enabledDays[0].date : null;
      const endDate = enabledDays.length > 0 ? enabledDays[enabledDays.length - 1].date : null;

      const scheduleForDb = scheduledDays.map(({ date, enabled }) => ({
        date,
        enabled
      }));

      const settings: BoostSettings = {
        targeting: {
          type: targetingOption,
          daysThreshold: parseInt(daysThreshold),
        },
        schedule: scheduleForDb,
        discount: {
          type: discountType,
          value: parseFloat(discountValue),
        },
        services: applyToAllServices ? "all" : selectedServices,
      };

      const { data: campaign, error: campaignError } = await supabase
        .from("marketing_campaigns")
        .upsert({
          business_id: business.id,
          campaign_type: "email",
          campaign_subtype: "boost",
          name: campaignName,
          is_active: isBoostStillValid(),
          start_date: startDate,
          end_date: endDate,
          settings: settings as any,
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      const { error: metricsError } = await supabase
        .from("campaign_metrics")
        .insert({
          campaign_id: campaign.id,
          users_targeted: targetAudienceSize,
          users_engaged: 0,
          users_opened: 0,
          users_clicked: 0,
          users_unsubscribed: 0
        });

      if (metricsError) throw metricsError;

      const isActive = isBoostStillValid();
      if (onSaveSuccess) {
        onSaveSuccess(isActive);
      }

      toast({
        title: "Campaign Saved",
        description: "Your boost campaign has been configured successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Error",
        description: "Failed to save campaign configuration",
        variant: "destructive",
      });
    }
  };

  return { handleSave };
};
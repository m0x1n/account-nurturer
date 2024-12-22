import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBoostValidation } from "./validation/useBoostValidation";
import { useAudienceCalculation } from "./audience/useAudienceCalculation";
import { useEmailTesting } from "./email/useEmailTesting";
import { useScheduling } from "./schedule/useScheduling";
import { BoostSettings } from "../types/campaignSettings";

export const useBoostCampaign = (
  business: any,
  onClose: () => void,
  onSaveSuccess?: (isActive: boolean) => void
) => {
  const { toast } = useToast();
  const { checkExistingBoostCampaign, validateBusinessData } = useBoostValidation(business);
  const { calculateTargetAudience } = useAudienceCalculation(business);
  const { handleTestEmail: handleTestEmailSend } = useEmailTesting();
  const { scheduledDays, handleDayToggle, isBoostStillValid, setScheduledDays } = useScheduling();

  const [campaignName, setCampaignName] = useState("");
  const [targetingOption, setTargetingOption] = useState("all");
  const [daysThreshold, setDaysThreshold] = useState("30");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [applyToAllServices, setApplyToAllServices] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const loadExistingCampaign = async () => {
      if (!business?.id) return;

      const { data: existingCampaign, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('campaign_subtype', 'boost')
        .eq('business_id', business.id)
        .is('archived_at', null)
        .maybeSingle();

      if (error) {
        console.error('Error loading campaign:', error);
        return;
      }

      if (existingCampaign) {
        const settings = existingCampaign.settings as BoostSettings;
        setCampaignName(existingCampaign.name);
        setTargetingOption(settings.targeting?.type || "all");
        setDaysThreshold(settings.targeting?.daysThreshold?.toString() || "30");
        setDiscountType(settings.discount?.type || "percent");
        setDiscountValue(settings.discount?.value?.toString() || "");
        setApplyToAllServices(settings.services === "all");
        setSelectedServices(settings.services === "all" ? [] : (settings.services as string[]));
        
        if (settings.schedule) {
          setScheduledDays(settings.schedule);
        }
      }
    };

    loadExistingCampaign();
  }, [business?.id, setScheduledDays]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleTestEmail = () => {
    handleTestEmailSend(
      testEmail,
      targetingOption,
      daysThreshold,
      discountType,
      discountValue,
      applyToAllServices,
      selectedServices
    );
  };

  const handleSave = async () => {
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
          settings,
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

  return {
    campaignName,
    setCampaignName,
    targetingOption,
    setTargetingOption,
    daysThreshold,
    setDaysThreshold,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    selectedServices,
    setSelectedServices,
    applyToAllServices,
    setApplyToAllServices,
    testEmail,
    setTestEmail,
    showPreview,
    setShowPreview,
    scheduledDays,
    handleDayToggle,
    handleServiceToggle,
    handleTestEmail,
    handleSave,
  };
};
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoostSettings } from "../../types/campaignSettings";

export const useCampaignLoader = (
  businessId: string | undefined,
  setters: {
    setCampaignName: (name: string) => void;
    setTargetingOption: (option: string) => void;
    setDaysThreshold: (days: string) => void;
    setDiscountType: (type: string) => void;
    setDiscountValue: (value: string) => void;
    setApplyToAllServices: (value: boolean) => void;
    setSelectedServices: (services: string[]) => void;
    setIsActive: (active: boolean) => void;
    setScheduledDays: (days: any[]) => void;
  }
) => {
  useEffect(() => {
    const loadExistingCampaign = async () => {
      if (!businessId) return;

      const { data: existingCampaign, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('campaign_subtype', 'boost')
        .eq('business_id', businessId)
        .is('archived_at', null)
        .maybeSingle();

      if (error) {
        console.error('Error loading campaign:', error);
        return;
      }

      if (existingCampaign) {
        setters.setIsActive(existingCampaign.is_active || false);
        const settings = existingCampaign.settings as unknown as BoostSettings;
        setters.setCampaignName(existingCampaign.name);
        setters.setTargetingOption(settings.targeting?.type || "all");
        setters.setDaysThreshold(settings.targeting?.daysThreshold?.toString() || "30");
        setters.setDiscountType(settings.discount?.type || "percent");
        setters.setDiscountValue(settings.discount?.value?.toString() || "");
        setters.setApplyToAllServices(settings.services === "all");
        setters.setSelectedServices(settings.services === "all" ? [] : (settings.services as string[]));
        
        if (settings.schedule) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const updatedSchedule = settings.schedule.map(day => ({
            date: day.date,
            enabled: day.enabled,
            formatted: new Date(day.date).toLocaleDateString()
          }));
          
          setters.setScheduledDays(updatedSchedule);
        }
      }
    };

    loadExistingCampaign();
  }, [businessId, setters]);
};
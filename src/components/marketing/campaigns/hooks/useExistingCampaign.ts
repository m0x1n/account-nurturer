import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn } from "react-hook-form";
import { LastMinuteFormValues } from "../last-minute/types";
import { LastMinuteSettings } from "../types/campaignSettings";

export const useExistingCampaign = (
  businessId: string | undefined,
  form: UseFormReturn<LastMinuteFormValues>,
  campaignType: string
) => {
  useEffect(() => {
    const loadExistingCampaign = async () => {
      if (!businessId) return;

      const { data: existingCampaign, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('campaign_subtype', campaignType)
        .eq('business_id', businessId)
        .is('archived_at', null)
        .maybeSingle();

      if (error) {
        console.error('Error loading campaign:', error);
        return;
      }

      if (existingCampaign) {
        const settings = existingCampaign.settings as LastMinuteSettings;
        form.reset({
          isEnabled: existingCampaign.is_active,
          sendEmail: settings.sendEmail,
          sendSMS: settings.sendSMS,
          enableDiscounts: settings.enableDiscounts,
          discountType: settings.discountType,
          discountValue: settings.discountValue,
          customSubject: existingCampaign.custom_subject ? true : false,
          customMessage: existingCampaign.custom_message ? true : false,
          subjectText: existingCampaign.custom_subject || "",
          messageText: existingCampaign.custom_message || "",
        });
      }
    };

    loadExistingCampaign();
  }, [businessId, form]);
};
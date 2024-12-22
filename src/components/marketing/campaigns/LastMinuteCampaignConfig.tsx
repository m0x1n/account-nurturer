import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { CustomMessageSection } from "./last-minute/CustomMessageSection";
import { TargetingSection } from "./last-minute/TargetingSection";
import { DiscountSection } from "./last-minute/DiscountSection";
import { LastMinuteFormValues } from "./last-minute/types";
import { useToast } from "@/hooks/use-toast";
import { useBusinessData } from "@/hooks/useBusinessData";
import { useExistingCampaign } from "./hooks/useExistingCampaign";
import { LastMinuteSettings } from "./types/campaignSettings";

interface LastMinuteCampaignConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (isActive: boolean) => void;
}

export function LastMinuteCampaignConfig({ 
  isOpen, 
  onClose, 
  onSaveSuccess 
}: LastMinuteCampaignConfigProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { data: business } = useBusinessData();

  const form = useForm<LastMinuteFormValues>({
    defaultValues: {
      isEnabled: false,
      sendEmail: false,
      sendSMS: false,
      enableDiscounts: false,
      discountType: "percent",
      discountValue: 25,
      customSubject: false,
      customMessage: false,
      subjectText: "",
      messageText: "",
    },
  });

  useExistingCampaign(business?.id, form, 'last-minute');

  const handleSubmit = async (values: LastMinuteFormValues) => {
    if (!business?.id) {
      toast({
        title: "Error",
        description: "Business data not available",
        variant: "destructive",
      });
      return;
    }

    if (values.isEnabled && !values.sendEmail && !values.sendSMS) {
      toast({
        title: "Validation Error",
        description: "Please enable at least one communication channel (Email or Text Message)",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      
      const settings: LastMinuteSettings = {
        sendEmail: values.sendEmail,
        sendSMS: values.sendSMS,
        enableDiscounts: values.enableDiscounts,
        discountType: values.discountType,
        discountValue: values.discountValue,
      };

      const { data: existingCampaign, error: queryError } = await supabase
        .from('marketing_campaigns')
        .select('id, is_active')
        .eq('campaign_subtype', 'last-minute')
        .eq('business_id', business.id)
        .is('archived_at', null)
        .maybeSingle();

      if (queryError) throw queryError;

      if (existingCampaign) {
        const { error } = await supabase
          .from('marketing_campaigns')
          .update({
            is_active: values.isEnabled,
            settings,
            custom_subject: values.customSubject ? values.subjectText : null,
            custom_message: values.customMessage ? values.messageText : null,
            ...(values.isEnabled && { start_date: now }),
            ...(!values.isEnabled && { end_date: now }),
          })
          .eq('id', existingCampaign.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('marketing_campaigns')
          .insert({
            business_id: business.id,
            campaign_type: 'smart',
            campaign_subtype: 'last-minute',
            name: 'Last Minute Campaign',
            is_active: values.isEnabled,
            settings,
            custom_subject: values.customSubject ? values.subjectText : null,
            custom_message: values.customMessage ? values.messageText : null,
            start_date: values.isEnabled ? now : null,
          });

        if (error) throw error;
      }
      
      onSaveSuccess(values.isEnabled);
      toast({
        title: values.isEnabled ? "Campaign Activated" : "Campaign Saved",
        description: values.isEnabled 
          ? "Your last minute campaign is now running" 
          : "Your settings have been saved",
      });
      onClose();
    } catch (error) {
      console.error("Error saving Last Minute Campaign:", error);
      toast({
        title: "Error",
        description: "Failed to save campaign settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const values = form.watch();
  const isSaveDisabled = isSaving || (values.isEnabled && !values.sendEmail && !values.sendSMS);

  if (!isOpen) return null;

  return (
    <div className="bg-background rounded-lg border p-6 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <TargetingSection form={form} />
          <DiscountSection form={form} />
          <CustomMessageSection form={form} />
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              Save Campaign
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
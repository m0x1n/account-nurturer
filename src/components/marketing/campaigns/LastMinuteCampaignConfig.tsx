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

  const handleSubmit = async (values: LastMinuteFormValues) => {
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('marketing_campaigns')
        .insert({
          campaign_type: 'smart',
          campaign_subtype: 'last-minute',
          name: 'Last Minute Campaign',
          is_active: values.isEnabled,
          settings: {
            sendEmail: values.sendEmail,
            sendSMS: values.sendSMS,
            enableDiscounts: values.enableDiscounts,
            discountType: values.discountType,
            discountValue: values.discountValue,
          },
          custom_subject: values.customSubject ? values.subjectText : null,
          custom_message: values.customMessage ? values.messageText : null,
          // Set start_date when campaign is enabled
          start_date: values.isEnabled ? now : null,
          // Don't set end_date when enabling, only when disabling
          end_date: !values.isEnabled ? now : null,
          // created_at will be set automatically by the database
        });

      if (error) throw error;
      
      onSaveSuccess(values.isEnabled);
      toast({
        title: values.isEnabled ? "Campaign Activated" : "Campaign Saved",
        description: values.isEnabled 
          ? "Your last minute campaign is now running" 
          : "Your settings have been saved",
      });
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
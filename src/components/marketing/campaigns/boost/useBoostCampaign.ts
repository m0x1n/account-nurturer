import { useState } from "react";
import { addDays, format, isAfter } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ScheduleDay {
  date: string;
  enabled: boolean;
  formatted: string;
}

export const useBoostCampaign = (
  business: any,
  onClose: () => void,
  onSaveSuccess?: (isActive: boolean) => void
) => {
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState("");
  const [targetingOption, setTargetingOption] = useState("all");
  const [daysThreshold, setDaysThreshold] = useState("30");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [applyToAllServices, setApplyToAllServices] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date: format(date, "yyyy-MM-dd"),
      enabled: true,
      formatted: format(date, "EEEE (MMM d)"),
    };
  });

  const [scheduledDays, setScheduledDays] = useState(nextSevenDays);

  const handleDayToggle = (index: number) => {
    setScheduledDays(days =>
      days.map((day, i) =>
        i === index ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const isBoostStillValid = () => {
    const lastDay = scheduledDays[scheduledDays.length - 1].date;
    return isAfter(new Date(lastDay), new Date());
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/send-test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          campaign: "boost",
          settings: {
            targeting: { type: targetingOption, daysThreshold },
            discount: { type: discountType, value: discountValue },
            services: applyToAllServices ? "all" : selectedServices,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to send test email");

      toast({
        title: "Test Email Sent",
        description: "Please check your inbox for the test email",
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!business?.id) {
      toast({
        title: "Error",
        description: "Business data not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: campaign, error: campaignError } = await supabase
        .from("marketing_campaigns")
        .upsert({
          business_id: business.id,
          campaign_type: "email",
          name: campaignName,
          is_active: isBoostStillValid(),
          settings: {
            targeting: {
              type: targetingOption,
              daysThreshold: parseInt(daysThreshold),
            },
            schedule: scheduledDays.map(day => ({
              date: day.date,
              enabled: day.enabled,
              formatted: day.formatted,
            })),
            discount: {
              type: discountType,
              value: parseFloat(discountValue),
            },
            services: applyToAllServices ? "all" : selectedServices,
          },
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create initial metrics for the campaign - removing generated columns
      const { error: metricsError } = await supabase
        .from("campaign_metrics")
        .insert({
          campaign_id: campaign.id,
          users_targeted: 0,
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
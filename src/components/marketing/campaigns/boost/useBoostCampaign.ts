import { useState } from "react";
import { addDays, format, isAfter, subDays } from "date-fns";
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

  const calculateTargetAudience = async () => {
    if (!business?.id) return 0;

    if (targetingOption === 'all') {
      // Count all clients for the business
      const { count } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id);
      
      return count || 0;
    } else {
      // Count clients with no recent visits
      const thresholdDate = subDays(new Date(), parseInt(daysThreshold));
      
      // Get clients with completed appointments in the threshold period
      const { data: appointments } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('business_id', business.id)
        .eq('status', 'completed')
        .gte('start_time', thresholdDate.toISOString())
        .lt('start_time', new Date().toISOString());

      // Get clients with future appointments
      const { data: futureAppointments } = await supabase
        .from('appointments')
        .select('client_id')
        .eq('business_id', business.id)
        .gte('start_time', new Date().toISOString());

      // Get all client IDs that should be excluded
      const excludedClientIds = new Set([
        ...(appointments?.map(a => a.client_id) || []),
        ...(futureAppointments?.map(a => a.client_id) || [])
      ]);

      // Count total clients minus excluded ones
      const { count } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .not('id', 'in', `(${Array.from(excludedClientIds).join(',')})`);

      return count || 0;
    }
  };

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
      // Calculate target audience size
      const targetAudienceSize = await calculateTargetAudience();

      const { data: campaign, error: campaignError } = await supabase
        .from("marketing_campaigns")
        .upsert({
          business_id: business.id,
          campaign_type: "email",
          campaign_subtype: "boost", // Explicitly set the subtype
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

      // Create initial metrics for the campaign
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

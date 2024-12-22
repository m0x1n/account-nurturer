import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useBusinessServices } from "@/hooks/useBusinessServices";
import { useBusinessData } from "@/hooks/useBusinessData";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";
import { TargetingSection } from "./boost/TargetingSection";
import { ScheduleSection } from "./boost/ScheduleSection";
import { OfferSection } from "./boost/OfferSection";
import { ServicesSection } from "./boost/ServicesSection";

interface BoostCampaignConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BoostCampaignConfig({ isOpen, onClose }: BoostCampaignConfigProps) {
  const { toast } = useToast();
  const { data: business } = useBusinessData();
  const { data: services } = useBusinessServices(business?.id);
  
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
      const { error } = await supabase
        .from("marketing_campaigns")
        .upsert({
          business_id: business.id,
          campaign_type: "email",
          name: "Boost Campaign",
          is_active: true,
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
        });

      if (error) throw error;

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

  if (!isOpen) return null;

  return (
    <div className="bg-background rounded-lg border p-6 space-y-8">
      <div className="space-y-8">
        <TargetingSection
          targetingOption={targetingOption}
          daysThreshold={daysThreshold}
          onTargetingChange={setTargetingOption}
          onDaysChange={setDaysThreshold}
        />

        <ScheduleSection
          days={scheduledDays}
          onDayToggle={handleDayToggle}
        />

        <OfferSection
          discountType={discountType}
          discountValue={discountValue}
          onDiscountTypeChange={setDiscountType}
          onDiscountValueChange={setDiscountValue}
        />

        <ServicesSection
          services={services}
          selectedServices={selectedServices}
          applyToAllServices={applyToAllServices}
          onServiceToggle={handleServiceToggle}
          onApplyToAllChange={setApplyToAllServices}
        />

        {showPreview && (
          <div className="p-4 border rounded-lg bg-muted">
            <h4 className="font-medium mb-2">Your offer: {discountValue}{discountType === "percent" ? "% off" : "$ off"} today & tomorrow!</h4>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Hide Preview" : "View Sample Email"}
            </Button>
            <div className="flex-1 flex items-center gap-2">
              <Input
                type="email"
                placeholder="Enter email for test"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Button onClick={handleTestEmail}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Campaign
        </Button>
      </div>
    </div>
  );
}

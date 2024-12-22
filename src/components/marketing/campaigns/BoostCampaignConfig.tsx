import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBusinessServices } from "@/hooks/useBusinessServices";
import { useBusinessData } from "@/hooks/useBusinessData";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";

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
  
  // Generate next 7 days
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date,
      enabled: true,
      formatted: format(date, "EEE, MMM d"),
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

  const handleSave = async () => {
    if (!business?.id) return;

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
            schedule: scheduledDays,
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
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Boost Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target Audience */}
          <div className="space-y-4">
            <Label>Target Audience</Label>
            <RadioGroup value={targetingOption} onValueChange={setTargetingOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Contacts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="inactive" />
                <Label htmlFor="inactive">No Recent Visit</Label>
                {targetingOption === "inactive" && (
                  <Input
                    type="number"
                    value={daysThreshold}
                    onChange={(e) => setDaysThreshold(e.target.value)}
                    className="w-20 ml-2"
                    min="1"
                  />
                )}
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </RadioGroup>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <Label>Campaign Schedule</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scheduledDays.map((day, index) => (
                <div key={day.formatted} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{day.formatted}</span>
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={() => handleDayToggle(index)}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Campaign will end on {scheduledDays[scheduledDays.length - 1].formatted}
            </p>
          </div>

          {/* Offer Details */}
          <div className="space-y-4">
            <Label>Offer Details</Label>
            <div className="flex items-center gap-4">
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percent Off</SelectItem>
                  <SelectItem value="amount">Money Off</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-24"
                placeholder={discountType === "percent" ? "%" : "$"}
              />
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={applyToAllServices}
                onCheckedChange={setApplyToAllServices}
              />
              <Label>Apply to all services</Label>
            </div>
            
            {!applyToAllServices && services && (
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center gap-2">
                    <Switch
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={(checked) => {
                        setSelectedServices(prev =>
                          checked
                            ? [...prev, service.id]
                            : prev.filter(id => id !== service.id)
                        );
                      }}
                    />
                    <Label>{service.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview and Test */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Enter email for test"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <Button variant="outline" onClick={handleTestEmail}>
                  Send Test
                </Button>
              </div>
            </div>

            {showPreview && (
              <div className="p-4 border rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Email Preview</h4>
                <div className="prose prose-sm">
                  <p>Subject: Special Offer Just for You!</p>
                  <p>
                    {`Get ${discountType === "percent" ? `${discountValue}% off` : `$${discountValue} off`} `}
                    {applyToAllServices ? "all services" : "selected services"}!
                  </p>
                  <p>Book now to take advantage of this special offer.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
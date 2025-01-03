import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessData } from "@/hooks/useBusinessData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

interface ReminderCampaignConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (isActive: boolean) => void;
}

export function ReminderCampaignConfig({ isOpen, onClose, onSaveSuccess }: ReminderCampaignConfigProps) {
  const { data: business } = useBusinessData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    daysThreshold: 30,
    includeDiscount: false,
    discountType: "percent",
    discountValue: 10,
    customMessage: "",
  });

  const handleSave = async (activate: boolean) => {
    if (!business?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .upsert({
          business_id: business.id,
          campaign_type: 'email',
          campaign_subtype: 'reminder',
          name: 'Reminder to Book Again',
          is_active: activate,
          settings: settings,
          status: activate ? 'active' : 'draft',
          custom_message: settings.customMessage,
        });

      if (error) throw error;

      toast({
        title: activate ? "Campaign Activated" : "Campaign Saved",
        description: activate 
          ? "Your reminder campaign is now running" 
          : "Your reminder campaign settings have been saved",
      });

      onSaveSuccess?.(activate);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save campaign settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configure Reminder Campaign</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Days since last visit</Label>
              <Input
                type="number"
                value={settings.daysThreshold}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  daysThreshold: parseInt(e.target.value) || 30
                }))}
                min={1}
                max={365}
              />
              <p className="text-sm text-muted-foreground">
                Send reminders to clients who haven't visited in this many days
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Include a discount</Label>
                <Switch
                  checked={settings.includeDiscount}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    includeDiscount: checked
                  }))}
                />
              </div>
            </div>

            {settings.includeDiscount && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={settings.discountType}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      discountType: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    {settings.discountType === "percent" ? "Discount Percentage" : "Discount Amount"}
                  </Label>
                  <Input
                    type="number"
                    value={settings.discountValue}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      discountValue: parseInt(e.target.value) || 0
                    }))}
                    min={0}
                    max={settings.discountType === "percent" ? 100 : 1000}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Custom Message (Optional)</Label>
              <Input
                value={settings.customMessage}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  customMessage: e.target.value
                }))}
                placeholder="Add a personal touch to your reminder message"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(false)} disabled={isLoading}>
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isLoading}>
              Save & Activate
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
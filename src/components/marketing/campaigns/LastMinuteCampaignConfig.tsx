import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { CustomMessageSection } from "./last-minute/CustomMessageSection";
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>Turn on this feature</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sendEmail"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>Send via Email</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sendSMS"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Send via Text Message</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <p className="text-sm text-muted-foreground">
                We'll make sure your texts only send during daytime hours (9AM - 9PM).
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableDiscounts"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Enable Discounts</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow Marketing Suite to offer a discount (recommended)
              </p>
            </FormItem>
          )}
        />

        {form.watch("enableDiscounts") && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Offer</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percent" id="percent" />
                        <Label htmlFor="percent">Percent Off</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="money" id="money" />
                        <Label htmlFor="money">Money Off</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="w-20"
                    />
                  </FormControl>
                  <span>
                    {form.watch("discountType") === "percent" ? "% off" : "$ off"}
                  </span>
                </FormItem>
              )}
            />
          </div>
        )}

        <CustomMessageSection form={form} />
      </form>
    </Form>
  );
}
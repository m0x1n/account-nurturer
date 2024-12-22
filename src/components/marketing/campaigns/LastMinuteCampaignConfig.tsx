import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface LastMinuteCampaignConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (isActive: boolean) => void;
}

interface LastMinuteFormValues {
  isEnabled: boolean;
  sendEmail: boolean;
  sendSMS: boolean;
  enableDiscounts: boolean;
  discountType: "percent" | "money";
  discountValue: number;
  customSubject: boolean;
  customMessage: boolean;
}

export function LastMinuteCampaignConfig({ 
  isOpen, 
  onClose, 
  onSaveSuccess 
}: LastMinuteCampaignConfigProps) {
  const [isSaving, setIsSaving] = useState(false);

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
    },
  });

  const handleSubmit = async (values: LastMinuteFormValues) => {
    setIsSaving(true);
    try {
      // TODO: Implement the save functionality
      console.log("Saving Last Minute Campaign settings:", values);
      onSaveSuccess(values.isEnabled);
    } catch (error) {
      console.error("Error saving Last Minute Campaign:", error);
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
                  <span>% off</span>
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="customSubject"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>Custom Subject Line</FormLabel>
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
          name="customMessage"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>Custom Message</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { LastMinuteFormValues } from "./types";

interface TargetingSectionProps {
  form: UseFormReturn<LastMinuteFormValues>;
}

export function TargetingSection({ form }: TargetingSectionProps) {
  return (
    <div className="space-y-4">
      <FormLabel className="text-sm font-medium">Communication Channels</FormLabel>
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
    </div>
  );
}
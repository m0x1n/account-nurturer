import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { LastMinuteFormValues } from "./types";

interface TargetingSectionProps {
  form: UseFormReturn<LastMinuteFormValues>;
  readOnly?: boolean;
}

export function TargetingSection({ form, readOnly }: TargetingSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>Enable Campaign</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, we'll automatically promote your available slots to fill last-minute openings
            </p>
          </FormItem>
        )}
      />

      <div className={readOnly ? 'opacity-70 pointer-events-none' : ''}>
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
                  disabled={readOnly}
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
                    disabled={readOnly}
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
    </div>
  );
}
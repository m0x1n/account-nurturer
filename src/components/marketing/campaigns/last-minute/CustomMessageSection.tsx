import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { LastMinuteFormValues } from "./types";

interface CustomMessageSectionProps {
  form: UseFormReturn<LastMinuteFormValues>;
  readOnly?: boolean;
}

export function CustomMessageSection({ form, readOnly }: CustomMessageSectionProps) {
  const showSubjectInput = form.watch("customSubject");
  const showMessageInput = form.watch("customMessage");

  return (
    <div className={`space-y-4 ${readOnly ? 'opacity-70' : ''}`}>
      <FormField
        control={form.control}
        name="customSubject"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>Custom Subject Line</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={readOnly}
                />
              </FormControl>
            </div>
            {showSubjectInput && (
              <FormField
                control={form.control}
                name="subjectText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter subject line"
                        maxLength={100}
                        readOnly={readOnly}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      {field.value?.length || 0}/100 characters
                    </p>
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customMessage"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel>Custom Message</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={readOnly}
                />
              </FormControl>
            </div>
            {showMessageInput && (
              <FormField
                control={form.control}
                name="messageText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your custom message"
                        maxLength={250}
                        className="h-24"
                        readOnly={readOnly}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      {field.value?.length || 0}/250 characters
                    </p>
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
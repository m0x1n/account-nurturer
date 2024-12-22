import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { LastMinuteFormValues } from "./types";

interface DiscountSectionProps {
  form: UseFormReturn<LastMinuteFormValues>;
  readOnly?: boolean;
}

export function DiscountSection({ form, readOnly }: DiscountSectionProps) {
  const showDiscountOptions = form.watch("enableDiscounts");

  return (
    <div className={`space-y-4 ${readOnly ? 'opacity-70' : ''}`}>
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
                  disabled={readOnly}
                />
              </FormControl>
            </div>
            <p className="text-sm text-muted-foreground">
              Allow us to offer intelligent discount (recommended)
            </p>
          </FormItem>
        )}
      />

      {showDiscountOptions && (
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
                    disabled={readOnly}
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
                    readOnly={readOnly}
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
    </div>
  );
}
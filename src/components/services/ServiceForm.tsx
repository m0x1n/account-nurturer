import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  deposit_type: z.enum(["fixed", "percentage"]),
  deposit_amount: z.string(),
  cancellation_hours: z.string(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormData>;
  onSubmit: (values: ServiceFormData) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function ServiceForm({ defaultValues, onSubmit, onCancel, submitLabel }: ServiceFormProps) {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      deposit_type: "fixed",
      deposit_amount: "",
      cancellation_hours: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input {...field} className="border-[#DBDBDB]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="border-[#DBDBDB]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" step="0.01" className="border-[#DBDBDB]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deposit_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deposit Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#DBDBDB]">
                    <SelectValue placeholder="Select deposit type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deposit_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Deposit Amount ({form.watch("deposit_type") === "percentage" ? "%" : "$"})
              </FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" step="0.01" className="border-[#DBDBDB]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cancellation_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cancellation Window (hours)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" className="border-[#DBDBDB]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-[#DBDBDB] text-[#262626]"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-[#0095F6] hover:bg-[#0095F6]/90"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
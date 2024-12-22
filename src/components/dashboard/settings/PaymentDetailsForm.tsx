import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  bank_name: z.string().min(1, "Bank name is required"),
  account_number: z.string().min(1, "Account number is required"),
  routing_number: z.string().min(9, "Routing number must be 9 digits").max(9),
  account_type: z.enum(["personal", "business"]),
  account_holder_name: z.string().min(1, "Account holder name is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentDetailsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank_name: "",
      account_number: "",
      routing_number: "",
      account_type: "personal",
      account_holder_name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Get the business ID for the current user
      const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!business) throw new Error("No business found");

      // Insert the bank account details
      const { error } = await supabase.from("bank_accounts").insert({
        business_id: business.id,
        account_number: data.account_number,
        routing_number: data.routing_number,
        bank_name: data.bank_name,
        account_type: data.account_type,
        account_holder_name: data.account_holder_name,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment details have been saved successfully.",
      });

      // Invalidate the bank account query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["bank-account"] });
    } catch (error) {
      console.error("Error saving payment details:", error);
      toast({
        title: "Error",
        description: "Failed to save payment details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Set Up Payment Details</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bank_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bank name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_holder_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account holder name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter account number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="routing_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Routing Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 9-digit routing number"
                    maxLength={9}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Payment Details"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
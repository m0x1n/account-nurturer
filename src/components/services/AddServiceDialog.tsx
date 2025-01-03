import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useBusinessData } from "@/hooks/useBusinessData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  deposit_type: z.enum(["fixed", "percentage"]),
  deposit_amount: z.string(),
  cancellation_hours: z.string(),
});

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddServiceDialog({ open, onOpenChange }: AddServiceDialogProps) {
  const { data: businessData } = useBusinessData();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      deposit_type: "fixed",
      deposit_amount: "",
      cancellation_hours: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!businessData?.id) {
      toast({
        title: "Error",
        description: "Please create a business first",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("services").insert({
      business_id: businessData.id,
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      deposit_type: values.deposit_type,
      deposit_amount: values.deposit_amount ? parseFloat(values.deposit_amount) : null,
      cancellation_hours: values.cancellation_hours ? parseInt(values.cancellation_hours) : null,
      forfeit_deposit: true,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["services"] });
    toast({
      title: "Success",
      description: "Service created successfully",
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#262626]">Add New Service</DialogTitle>
        </DialogHeader>
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
                onClick={() => onOpenChange(false)}
                className="border-[#DBDBDB] text-[#262626]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#0095F6] hover:bg-[#0095F6]/90"
              >
                Create Service
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
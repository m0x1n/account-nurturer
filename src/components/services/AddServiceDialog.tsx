import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBusinessData } from "@/hooks/useBusinessData";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ServiceForm, ServiceFormData } from "./ServiceForm";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddServiceDialog({ open, onOpenChange }: AddServiceDialogProps) {
  const { data: businessData } = useBusinessData();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function onSubmit(values: ServiceFormData) {
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
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#262626]">Add New Service</DialogTitle>
        </DialogHeader>
        <ServiceForm
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Create Service"
        />
      </DialogContent>
    </Dialog>
  );
}
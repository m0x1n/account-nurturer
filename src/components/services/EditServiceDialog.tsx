import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ServiceForm, ServiceFormData } from "./ServiceForm";

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    deposit_type: "fixed" | "percentage" | null;
    deposit_amount: number | null;
    cancellation_hours: number | null;
  };
}

export function EditServiceDialog({ open, onOpenChange, service }: EditServiceDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function onSubmit(values: ServiceFormData) {
    const { error } = await supabase
      .from("services")
      .update({
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        deposit_type: values.deposit_type,
        deposit_amount: values.deposit_amount ? parseFloat(values.deposit_amount) : null,
        cancellation_hours: values.cancellation_hours ? parseInt(values.cancellation_hours) : null,
      })
      .eq("id", service.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["services"] });
    toast({
      title: "Success",
      description: "Service updated successfully",
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#262626]">Edit Service</DialogTitle>
        </DialogHeader>
        <ServiceForm
          defaultValues={{
            name: service.name,
            description: service.description || "",
            price: service.price.toString(),
            deposit_type: service.deposit_type || "fixed",
            deposit_amount: service.deposit_amount?.toString() || "",
            cancellation_hours: service.cancellation_hours?.toString() || "",
          }}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}
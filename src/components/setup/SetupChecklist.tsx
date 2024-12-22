import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

const SetupChecklist = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const { data: businessData } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      return businesses;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!businessData?.id) return [];
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", businessData.id);
      return data || [];
    },
    enabled: !!businessData?.id,
  });

  const { data: staff } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!businessData?.id) return [];
      const { data } = await supabase
        .from("staff_members")
        .select("*")
        .eq("business_id", businessData.id);
      return data || [];
    },
    enabled: !!businessData?.id,
  });

  const { data: businessHours } = useQuery({
    queryKey: ["business-hours"],
    queryFn: async () => {
      if (!businessData?.id) return [];
      const { data } = await supabase
        .from("business_hours")
        .select("*")
        .eq("business_id", businessData.id);
      return data || [];
    },
    enabled: !!businessData?.id,
  });

  const { data: bankAccount } = useQuery({
    queryKey: ["bank-account"],
    queryFn: async () => {
      if (!businessData?.id) return null;
      const { data } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("business_id", businessData.id)
        .maybeSingle();
      return data;
    },
    enabled: !!businessData?.id,
  });

  const { data: bookingLink } = useQuery({
    queryKey: ["booking-link"],
    queryFn: async () => {
      if (!businessData?.id) return null;
      const { data } = await supabase
        .from("booking_links")
        .select("*")
        .eq("business_id", businessData.id)
        .maybeSingle();
      return data;
    },
    enabled: !!businessData?.id,
  });

  const checklistItems: ChecklistItem[] = [
    {
      id: "business-hours",
      title: "Set Your Business Hours",
      description: "Define your working days and hours",
      route: "/dashboard/settings/business-hours",
      completed: businessHours && businessHours.length > 0,
    },
    {
      id: "services",
      title: "Add Services",
      description: "Create services that you offer to your clients",
      route: "/dashboard/services",
      completed: services && services.length > 0,
    },
    {
      id: "staff",
      title: "Add Staff Members",
      description: "Add your team members who will provide services",
      route: "/dashboard/staff",
      completed: staff && staff.length > 0,
    },
    {
      id: "bank-account",
      title: "Set Up Payment Details",
      description: "Add your bank account to receive payments",
      route: "/dashboard/settings/payment-settings",
      completed: !!bankAccount,
    },
    {
      id: "import-clients",
      title: "Import Client Records",
      description: "Import your existing client records via CSV",
      route: "/dashboard/clients/import",
      completed: false,
    },
    {
      id: "booking-link",
      title: "Share Booking Link",
      description: "Get your booking link to share with clients",
      route: "/dashboard/settings/booking-link",
      completed: !!bookingLink,
    },
  ];

  useEffect(() => {
    const completedItems = checklistItems.filter(item => item.completed).length;
    const totalProgress = (completedItems / checklistItems.length) * 100;
    setProgress(totalProgress);
  }, [checklistItems]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Setup Checklist</h1>
        <p className="text-muted-foreground">
          Complete these steps to get your business ready for appointments
        </p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {checklistItems.filter(item => item.completed).length} of {checklistItems.length} tasks completed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 flex items-start justify-between hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {item.completed ? (
                <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground mt-1" />
              )}
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <Button
              variant={item.completed ? "outline" : "default"}
              size="sm"
              onClick={() => navigate(item.route)}
              className="flex items-center gap-2"
            >
              {item.completed ? (
                <>
                  <Clock className="h-4 w-4" />
                  Review
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Complete
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupChecklist;

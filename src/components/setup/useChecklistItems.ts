import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistItem } from "./types";

export const useChecklistItems = () => {
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
      route: "/dashboard/settings/import-clients", // Fixed the route here
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

  return checklistItems;
};
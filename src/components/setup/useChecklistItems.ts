import { useBusinessData } from "@/hooks/useBusinessData";
import { useBusinessServices } from "@/hooks/useBusinessServices";
import { useStaffMembers } from "@/hooks/useStaffMembers";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { useBankAccount } from "@/hooks/useBankAccount";
import { useBookingLink } from "@/hooks/useBookingLink";
import { ChecklistItem } from "./types";

export const useChecklistItems = () => {
  const { data: businessData } = useBusinessData();
  const { data: services } = useBusinessServices(businessData?.id);
  const { data: staff } = useStaffMembers(businessData?.id);
  const { data: businessHours } = useBusinessHours(businessData?.id);
  const { data: bankAccount } = useBankAccount(businessData?.id);
  const { data: bookingLink } = useBookingLink(businessData?.id);

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
      route: "/dashboard/settings/import-clients",
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
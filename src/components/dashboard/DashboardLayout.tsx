import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardContent } from "./DashboardContent";
import { AppointmentsContent } from "./AppointmentsContent";
import Staff from "@/pages/dashboard/Staff";
import Clients from "@/pages/dashboard/Clients";
import SetupChecklist from "@/components/setup/SetupChecklist";
import PaymentSettings from "@/pages/dashboard/PaymentSettings";
import BusinessHours from "@/pages/dashboard/BusinessHours";
import BookingLink from "@/pages/dashboard/BookingLink";
import Settings from "@/pages/dashboard/Settings";
import POS from "@/pages/dashboard/POS";
import Insights from "@/pages/dashboard/Insights";
import Marketing from "@/pages/dashboard/Marketing";
import EmailMarketing from "@/pages/dashboard/marketing/EmailMarketing";
import Engage from "@/pages/dashboard/marketing/Engage";
import AddOns from "@/pages/dashboard/AddOns";
import QuickLinks from "@/pages/dashboard/QuickLinks";
import ServicesAndProducts from "@/pages/dashboard/ServicesAndProducts";
import ImportClients from "@/pages/dashboard/ImportClients";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <DashboardSidebar onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="setup-checklist" element={<SetupChecklist />} />
            <Route path="staff" element={<Staff />} />
            <Route path="clients" element={<Clients />} />
            <Route path="services" element={<ServicesAndProducts />} />
            <Route path="appointments" element={<AppointmentsContent />} />
            <Route path="pos" element={<POS />} />
            <Route path="insights" element={<Insights />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="marketing/email" element={<EmailMarketing />} />
            <Route path="marketing/engage" element={<Engage />} />
            <Route path="add-ons" element={<AddOns />} />
            <Route path="quick-links" element={<QuickLinks />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/payment-settings" element={<PaymentSettings />} />
            <Route path="settings/business-hours" element={<BusinessHours />} />
            <Route path="settings/booking-link" element={<BookingLink />} />
            <Route path="settings/import-clients" element={<ImportClients />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
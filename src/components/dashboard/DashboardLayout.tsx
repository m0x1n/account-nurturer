import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardContent } from "./DashboardContent";
import Staff from "@/pages/dashboard/Staff";
import Clients from "@/pages/dashboard/Clients";
import { SetupChecklist } from "@/components/setup/SetupChecklist";
import PaymentSettings from "@/pages/dashboard/PaymentSettings";
import BusinessHours from "@/pages/dashboard/BusinessHours";
import BookingLink from "@/pages/dashboard/BookingLink";
import Settings from "@/pages/dashboard/Settings";
import POS from "@/pages/dashboard/POS";
import Insights from "@/pages/dashboard/Insights";
import Marketing from "@/pages/dashboard/Marketing";
import AddOns from "@/pages/dashboard/AddOns";
import QuickLinks from "@/pages/dashboard/QuickLinks";
import ServicesAndProducts from "@/pages/dashboard/ServicesAndProducts";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="setup-checklist" element={<SetupChecklist />} />
          <Route path="staff" element={<Staff />} />
          <Route path="clients" element={<Clients />} />
          <Route path="services-and-products" element={<ServicesAndProducts />} />
          <Route path="pos" element={<POS />} />
          <Route path="insights" element={<Insights />} />
          <Route path="marketing" element={<Marketing />} />
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
  );
};

export default DashboardLayout;

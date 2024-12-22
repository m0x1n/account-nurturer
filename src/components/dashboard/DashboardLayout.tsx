import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardContent } from "./DashboardContent";
import { AppointmentsContent } from "./AppointmentsContent";
import Staff from "@/pages/dashboard/Staff";
import Clients from "@/pages/dashboard/Clients";
import SetupChecklist from "@/components/setup/SetupChecklist";
import PaymentSettings from "@/pages/dashboard/PaymentSettings";
import ImportClients from "@/pages/dashboard/ImportClients";
import BusinessHours from "@/pages/dashboard/BusinessHours";
import BookingLink from "@/pages/dashboard/BookingLink";
import Settings from "@/pages/dashboard/Settings";
import POS from "@/pages/dashboard/POS";
import Insights from "@/pages/dashboard/Insights";
import Marketing from "@/pages/dashboard/Marketing";
import AddOns from "@/pages/dashboard/AddOns";
import QuickLinks from "@/pages/dashboard/QuickLinks";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      }
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar onLogout={handleLogout} />
        <Routes>
          <Route index element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="appointments" element={<AppointmentsContent />} />
          <Route path="setup-checklist" element={<SetupChecklist />} />
          <Route path="staff" element={<Staff />} />
          <Route path="clients" element={<Clients />} />
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
    </SidebarProvider>
  );
};

export default DashboardLayout;
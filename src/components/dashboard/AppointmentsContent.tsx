import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarView } from "./appointments/CalendarView";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewAppointmentForm } from "./appointments/NewAppointmentForm";
import { AppointmentFilters } from "./appointments/AppointmentFilters";
import { AppointmentSection } from "./appointments/AppointmentSection";
import { AppointmentPagination } from "./appointments/AppointmentPagination";

export function AppointmentsContent() {
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(first_name, last_name),
          service:services(name, price),
          staff:staff_members(first_name, last_name)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const filterAppointments = (appointments: any[] | undefined) => {
    if (!appointments) return [];
    
    return appointments.filter(apt => {
      const matchesStaff = selectedStaffIds.length === 0 || selectedStaffIds.includes(apt.staff_id);
      const matchesDate = !selectedDate || format(new Date(apt.start_time), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        apt.client?.first_name?.toLowerCase().includes(searchLower) ||
        apt.client?.last_name?.toLowerCase().includes(searchLower) ||
        apt.staff?.first_name?.toLowerCase().includes(searchLower) ||
        apt.staff?.last_name?.toLowerCase().includes(searchLower);
      
      return matchesStaff && matchesDate && matchesSearch;
    });
  };

  const todayAppointments = filterAppointments(appointments?.filter(
    (apt) => format(new Date(apt.start_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ));

  const upcomingAppointments = filterAppointments(appointments?.filter(
    (apt) => new Date(apt.start_time) > new Date() && 
    format(new Date(apt.start_time), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  ));

  const pastAppointments = filterAppointments(appointments?.filter(
    (apt) => new Date(apt.start_time) < new Date()
  ));

  const paginatedUpcomingAppointments = upcomingAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );

  const totalPages = Math.ceil(upcomingAppointments.length / appointmentsPerPage);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Appointments</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CalendarIcon className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
              </DialogHeader>
              <NewAppointmentForm onSuccess={() => {
                refetch();
              }} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <AppointmentFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <div className="grid gap-4">
              <AppointmentSection
                title="Today's Appointments"
                appointments={todayAppointments}
                isLoading={isLoading}
              />

              <AppointmentSection
                title="Upcoming Appointments"
                appointments={paginatedUpcomingAppointments}
                isLoading={isLoading}
              >
                <AppointmentPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </AppointmentSection>

              <AppointmentSection
                title="Past Appointments"
                appointments={pastAppointments}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
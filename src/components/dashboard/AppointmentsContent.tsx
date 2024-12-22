import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarView } from "./appointments/CalendarView";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewAppointmentForm } from "./appointments/NewAppointmentForm";

export function AppointmentsContent() {
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(first_name, last_name),
          service:services(name, price)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const filterAppointmentsByStaff = (appointments: any[] | undefined) => {
    if (!appointments) return [];
    if (selectedStaffIds.length === 0) return appointments;
    return appointments.filter(apt => selectedStaffIds.includes(apt.staff_id));
  };

  const todayAppointments = filterAppointmentsByStaff(appointments?.filter(
    (apt) => format(new Date(apt.start_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ));

  const upcomingAppointments = filterAppointmentsByStaff(appointments?.filter(
    (apt) => new Date(apt.start_time) > new Date() && 
    format(new Date(apt.start_time), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  ));

  const pastAppointments = filterAppointmentsByStaff(appointments?.filter(
    (apt) => new Date(apt.start_time) < new Date()
  ));

  const renderAppointmentTable = (appointments: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              {format(new Date(appointment.start_time), 'MMM d, h:mm a')}
            </TableCell>
            <TableCell>
              {appointment.client?.first_name} {appointment.client?.last_name}
            </TableCell>
            <TableCell>{appointment.service?.name}</TableCell>
            <TableCell className="capitalize">{appointment.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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
                <Calendar className="h-4 w-4 mr-2" />
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

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : todayAppointments?.length ? (
                    renderAppointmentTable(todayAppointments)
                  ) : (
                    <p className="text-sm text-muted-foreground">No appointments for today</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : upcomingAppointments?.length ? (
                    renderAppointmentTable(upcomingAppointments)
                  ) : (
                    <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : pastAppointments?.length ? (
                    renderAppointmentTable(pastAppointments)
                  ) : (
                    <p className="text-sm text-muted-foreground">No past appointments</p>
                  )}
                </CardContent>
              </Card>
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
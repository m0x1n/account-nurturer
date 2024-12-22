import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CalendarView } from "./appointments/CalendarView";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewAppointmentForm } from "./appointments/NewAppointmentForm";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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

  // Pagination logic
  const paginatedUpcomingAppointments = upcomingAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );

  const totalPages = Math.ceil(upcomingAppointments.length / appointmentsPerPage);

  const renderAppointmentTable = (appointments: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Staff</TableHead>
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
            <TableCell>
              {appointment.staff?.first_name} {appointment.staff?.last_name}
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
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by client or staff name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDate(undefined)}
                >
                  Clear date
                </Button>
              )}
            </div>

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
                  ) : paginatedUpcomingAppointments?.length ? (
                    <>
                      {renderAppointmentTable(paginatedUpcomingAppointments)}
                      {totalPages > 1 && (
                        <Pagination className="mt-4">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </>
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
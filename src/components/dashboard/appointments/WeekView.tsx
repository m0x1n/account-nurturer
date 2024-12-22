import { format, addDays } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WeekViewProps {
  currentDate: Date;
  selectedStaffId: string;
}

export function WeekView({ currentDate, selectedStaffId }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentDate, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const { data: staffMember } = useQuery({
    queryKey: ['staff-member', selectedStaffId],
    queryFn: async () => {
      if (!selectedStaffId) return null;

      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('id', selectedStaffId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', currentDate, selectedStaffId],
    queryFn: async () => {
      if (!selectedStaffId) return [];

      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses || businesses.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(first_name, last_name),
          service:services(name)
        `)
        .eq('business_id', businesses[0].id)
        .eq('staff_id', selectedStaffId);

      if (error) throw error;
      return data || [];
    }
  });

  if (!staffMember) {
    return (
      <div className="mt-4 text-center text-muted-foreground">
        Please select a staff member to view their weekly schedule
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={staffMember.profile_image_url} />
          <AvatarFallback>{staffMember.first_name[0]}{staffMember.last_name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{staffMember.first_name} {staffMember.last_name}'s Schedule</span>
      </div>

      <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4">
        <div className="font-semibold">Time</div>
        {days.map(day => (
          <div key={day.toString()} className="font-semibold text-center">
            {format(day, 'EEE MMM d')}
          </div>
        ))}
        
        {hours.map(hour => (
          <>
            <div key={hour} className="text-sm text-muted-foreground">
              {format(new Date().setHours(hour, 0), 'h:mm a')}
            </div>
            {days.map(day => {
              const dayAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.start_time);
                return aptDate.getHours() === hour &&
                  format(aptDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
              });

              return (
                <div key={`${hour}-${day}`} className="min-h-[40px] border-t">
                  {dayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="bg-primary/10 p-2 text-sm rounded mb-1"
                    >
                      {apt.client?.first_name} {apt.client?.last_name} - {apt.service?.name}
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
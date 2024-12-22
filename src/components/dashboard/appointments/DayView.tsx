import React, { Fragment } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DayViewProps {
  currentDate: Date;
  selectedStaffIds: string[];
}

interface Appointment {
  id: string;
  business_id: string | null;
  client_id: string | null;
  service_id: string | null;
  staff_id?: string | null; // Made staff_id optional to match database schema
  start_time: string;
  end_time: string;
  status: string | null;
  notes: string | null;
  client?: {
    first_name: string;
    last_name: string;
  };
  service?: {
    name: string;
  };
}

export function DayView({ currentDate, selectedStaffIds }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const { data: staffMembers = [] } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses || businesses.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('business_id', businesses[0].id);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', currentDate, selectedStaffIds],
    queryFn: async () => {
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
        .eq('business_id', businesses[0].id);

      if (error) throw error;
      return (data || []) as Appointment[];
    }
  });

  const filteredStaff = selectedStaffIds.length > 0
    ? staffMembers.filter(staff => selectedStaffIds.includes(staff.id))
    : staffMembers;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[100px_repeat(auto-fill,minmax(200px,1fr))] gap-4">
        <div className="font-semibold">Time</div>
        {filteredStaff.map(staff => (
          <div key={staff.id} className="font-semibold text-center flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={staff.profile_image_url} />
              <AvatarFallback>{staff.first_name[0]}{staff.last_name[0]}</AvatarFallback>
            </Avatar>
            <span>{staff.first_name} {staff.last_name}</span>
          </div>
        ))}
        
        {hours.map(hour => (
          <Fragment key={hour}>
            <div className="text-sm text-muted-foreground">
              {format(new Date().setHours(hour, 0), 'h:mm a')}
            </div>
            {filteredStaff.map(staff => {
              const hourAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.start_time);
                return aptDate.getHours() === hour &&
                  format(aptDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
                  apt.staff_id === staff.id;
              });

              return (
                <div key={`${hour}-${staff.id}`} className="min-h-[40px] border-t">
                  {hourAppointments.map(apt => (
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
          </Fragment>
        ))}
      </div>
    </div>
  );
}
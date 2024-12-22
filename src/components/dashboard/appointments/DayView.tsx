import React, { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DayViewProps {
  currentDate: Date;
  selectedStaffIds?: string[];
}

interface Appointment {
  id: string;
  business_id: string | null;
  client_id: string | null;
  service_id: string | null;
  staff_id?: string | null;
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

export function DayView({ currentDate, selectedStaffIds = [] }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [currentTimeTop, setCurrentTimeTop] = useState<number>(0);

  // Update current time position every minute
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const percentage = (minutes / (24 * 60)) * 100;
      setCurrentTimeTop(percentage);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
      <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(200px,1fr))] gap-4 relative">
        <div className="font-semibold sticky left-0 z-20 bg-background">Time</div>
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
            <div className="text-sm text-muted-foreground sticky left-0 bg-background z-10">
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
                <div key={`${hour}-${staff.id}`} className="min-h-[60px] border-t relative">
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

        {/* Current time indicator */}
        {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
          <div 
            className="absolute left-0 right-0 flex items-center z-20"
            style={{ top: `${currentTimeTop}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
            <div className="flex-1 h-px bg-red-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
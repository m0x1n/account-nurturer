import React, { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return {
      start: new Date(currentDate).setHours(hour, 0, 0, 0),
      end: new Date(currentDate).setHours(hour + 1, 0, 0, 0),
    };
  });

  const [currentTimeTop, setCurrentTimeTop] = useState<number>(0);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const percentage = (minutes / (24 * 60)) * 100;
      setCurrentTimeTop(percentage);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: staffMembers = [] } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses?.length) return [];

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

      if (!businesses?.length) return [];

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
    <div className="mt-4 overflow-x-auto">
      <div className="grid grid-cols-[100px_repeat(auto-fill,minmax(200px,1fr))] gap-0 relative min-w-[600px]">
        {/* Time column header */}
        <div className="sticky top-0 left-0 z-30 bg-background h-20 border-b flex items-center justify-center">
          <span className="text-sm font-medium text-muted-foreground">Time</span>
        </div>
        
        {/* Staff headers with schedule time */}
        {filteredStaff.map(staff => (
          <div key={staff.id} className="sticky top-0 z-20 bg-background border-b p-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={staff.profile_image_url} />
                <AvatarFallback>{staff.first_name[0]}{staff.last_name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="text-sm font-medium">{staff.first_name} {staff.last_name}</div>
                <div className="text-xs text-muted-foreground">8:00 AM - 04:00 PM</div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Time slots */}
        {timeSlots.map(({ start }, index) => (
          <Fragment key={start}>
            <div className="sticky left-0 bg-background z-10 border-r h-16 flex items-center">
              <div className="text-sm text-muted-foreground px-4">
                {format(start, 'h:mm a')}
              </div>
            </div>
            {filteredStaff.map(staff => {
              const hourAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.start_time);
                return aptDate.getHours() === new Date(start).getHours() &&
                  format(aptDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
                  apt.staff_id === staff.id;
              });

              return (
                <div key={`${start}-${staff.id}`} className="h-16 border-b border-r relative">
                  {hourAppointments.map(apt => {
                    const startTime = new Date(apt.start_time);
                    const endTime = new Date(apt.end_time);
                    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                    const heightInPixels = (durationInMinutes / 60) * 64;

                    return (
                      <div
                        key={apt.id}
                        className={cn(
                          "absolute left-0 right-0 mx-1 p-2 rounded-md text-sm",
                          "bg-primary/10 hover:bg-primary/20 transition-colors",
                          "overflow-hidden text-left cursor-pointer shadow-sm"
                        )}
                        style={{
                          height: `${heightInPixels}px`,
                          top: `${(startTime.getMinutes() / 60) * 64}px`,
                        }}
                      >
                        <div className="font-medium truncate">
                          {apt.client?.first_name} {apt.client?.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {apt.service?.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Fragment>
        ))}

        {/* Current time indicator */}
        {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
          <div 
            className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
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
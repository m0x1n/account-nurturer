import React, { useEffect, useState } from "react";
import { format, addMinutes, startOfDay, differenceInMinutes } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DayViewProps {
  currentDate: Date;
  selectedStaffIds?: string[];
}

export function DayView({ currentDate, selectedStaffIds = [] }: DayViewProps) {
  const [currentTimeTop, setCurrentTimeTop] = useState<number>(0);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayStart = startOfDay(currentDate);

  // Update current time indicator position
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const percentage = (minutesSinceMidnight / (24 * 60)) * 100;
      setCurrentTimeTop(percentage);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', format(currentDate, 'yyyy-MM-dd'), selectedStaffIds],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses || businesses.length === 0) return [];

      let query = supabase
        .from('appointments')
        .select(`
          *,
          client:clients(first_name, last_name),
          service:services(name),
          staff:staff_members(first_name, last_name)
        `)
        .eq('business_id', businesses[0].id)
        .gte('start_time', format(currentDate, 'yyyy-MM-dd'))
        .lt('start_time', format(addMinutes(currentDate, 1440), 'yyyy-MM-dd'));

      if (selectedStaffIds.length > 0) {
        query = query.in('staff_id', selectedStaffIds);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const getAppointmentStyle = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const minutesFromMidnight = differenceInMinutes(start, dayStart);
    const duration = differenceInMinutes(end, start);
    
    return {
      top: `${(minutesFromMidnight / (24 * 60)) * 100}%`,
      height: `${(duration / (24 * 60)) * 100}%`,
    };
  };

  return (
    <div className="flex h-[calc(100vh-200px)] border rounded-lg bg-white">
      {/* Time column */}
      <div className="w-20 flex-shrink-0 border-r bg-white z-10">
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-16 border-b text-sm text-muted-foreground relative"
          >
            <span className="absolute -top-3 right-4">
              {format(new Date().setHours(hour, 0), 'h a')}
            </span>
          </div>
        ))}
      </div>

      {/* Main calendar grid */}
      <ScrollArea className="flex-1 relative">
        <div className="relative min-w-full">
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-100"
            />
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

          {/* Appointments */}
          {appointments.map((appointment) => {
            const style = getAppointmentStyle(appointment.start_time, appointment.end_time);
            
            return (
              <div
                key={appointment.id}
                className={cn(
                  "absolute left-1 right-1 rounded-md p-2",
                  "bg-primary/10 hover:bg-primary/20 transition-colors",
                  "cursor-pointer text-sm"
                )}
                style={style}
              >
                <div className="font-medium">
                  {appointment.client?.first_name} {appointment.client?.last_name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(appointment.start_time), 'h:mm a')} - {format(new Date(appointment.end_time), 'h:mm a')}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {appointment.service?.name}
                </div>
                {appointment.staff && (
                  <div className="text-xs text-muted-foreground">
                    with {appointment.staff.first_name} {appointment.staff.last_name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
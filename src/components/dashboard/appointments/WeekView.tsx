import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WeekViewProps {
  currentDate: Date;
  selectedStaffId?: string;
}

export function WeekView({ currentDate }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentDate, i));
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

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', currentDate],
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
          service:services(name),
          staff:staff_members(first_name, last_name)
        `)
        .eq('business_id', businesses[0].id);

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-4 relative">
        <div className="font-semibold sticky left-0 z-20 bg-background">Time</div>
        {days.map(day => (
          <div key={day.toString()} className="font-semibold text-center">
            {format(day, 'EEE MMM d')}
          </div>
        ))}
        
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="text-sm text-muted-foreground sticky left-0 bg-background z-10">
              {format(new Date().setHours(hour, 0), 'h:mm a')}
            </div>
            {days.map(day => {
              const dayAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.start_time);
                return aptDate.getHours() === hour &&
                  format(aptDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
              });

              return (
                <div key={`${hour}-${day}`} className="min-h-[60px] border-t relative">
                  {dayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="bg-primary/10 p-2 text-sm rounded mb-1"
                    >
                      {apt.client?.first_name} {apt.client?.last_name} - {apt.service?.name}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        with {apt.staff?.first_name} {apt.staff?.last_name}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Current time indicator */}
        {days.some(day => format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) && (
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
import React, { useEffect, useState } from "react";
import { format, addMinutes, startOfDay, differenceInMinutes } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayViewProps {
  currentDate: Date;
  selectedStaffIds?: string[];
}

export function DayView({ currentDate, selectedStaffIds = [] }: DayViewProps) {
  const [currentTimeTop, setCurrentTimeTop] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayStart = startOfDay(currentDate);
  const staffColumnWidth = 200; // Width of each staff column

  // Update current time indicator position
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const percentage = (minutesSinceMidnight / (24 * 60)) * 100;
      setCurrentTimeTop(percentage);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch staff members and their appointments
  const { data: staffData = [] } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses || businesses.length === 0) return [];

      const { data: staff } = await supabase
        .from('staff_members')
        .select('*')
        .eq('business_id', businesses[0].id)
        .eq('status', 'active');

      return staff || [];
    }
  });

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

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - staffColumnWidth));
  };

  const handleScrollRight = () => {
    const maxScroll = (staffData.length - 4) * staffColumnWidth;
    setScrollPosition(Math.min(maxScroll, scrollPosition + staffColumnWidth));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Staff header with scroll buttons */}
      <div className="flex items-center border-b bg-white sticky top-0 z-20">
        <div className="w-20 flex-shrink-0" /> {/* Time column space */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleScrollLeft}
          disabled={scrollPosition === 0}
          className="h-12"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex overflow-hidden">
          <div 
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {staffData.map((staff) => (
              <div
                key={staff.id}
                className="w-[200px] p-4 border-r flex-shrink-0 text-center font-medium"
              >
                {staff.first_name} {staff.last_name}
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleScrollRight}
          disabled={scrollPosition >= (staffData.length - 4) * staffColumnWidth}
          className="h-12"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Main calendar grid */}
      <div className="flex flex-1 border rounded-lg bg-white overflow-hidden">
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

        {/* Scrollable staff columns */}
        <ScrollArea className="flex-1 relative">
          <div 
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {staffData.map((staff) => (
              <div key={staff.id} className="w-[200px] flex-shrink-0 relative border-r">
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

                {/* Appointments for this staff member */}
                {appointments
                  .filter(apt => apt.staff_id === staff.id)
                  .map((appointment) => {
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
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
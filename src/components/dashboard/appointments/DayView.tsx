import React, { useEffect, useState } from "react";
import { format, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StaffHeader } from "./StaffHeader";
import { StaffColumn } from "./StaffColumn";
import { TIME_COLUMN_WIDTH } from "./constants";

interface DayViewProps {
  currentDate: Date;
  selectedStaffIds?: string[];
}

export function DayView({ currentDate, selectedStaffIds = [] }: DayViewProps) {
  const [currentTimeTop, setCurrentTimeTop] = useState<number>(0);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayStart = startOfDay(currentDate);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      // Calculate pixels from top based on 64px per hour (h-16 = 64px)
      const pixelsPerMinute = 64 / 60; // 64 pixels per hour divided by 60 minutes
      const pixelsFromTop = minutesSinceMidnight * pixelsPerMinute;
      const totalHeight = 24 * 64; // 24 hours * 64px per hour
      const percentage = (pixelsFromTop / totalHeight) * 100;
      setCurrentTimeTop(percentage);
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: staffData = [] } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses || businesses.length === 0) return [];

      let query = supabase
        .from('staff_members')
        .select('*')
        .eq('business_id', businesses[0].id)
        .eq('status', 'active');

      if (selectedStaffIds.length > 0) {
        query = query.in('id', selectedStaffIds);
      }

      const { data: staff } = await query;
      return staff || [];
    }
  });

  const { data: workingHours = [] } = useQuery({
    queryKey: ['working-hours', format(currentDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses || businesses.length === 0) return [];

      const { data } = await supabase
        .from('business_hours')
        .select('*')
        .eq('business_id', businesses[0].id)
        .eq('day_of_week', currentDate.getDay());

      return data || [];
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
        .lt('start_time', format(new Date(currentDate.getTime() + 86400000), 'yyyy-MM-dd'));

      if (selectedStaffIds.length > 0) {
        query = query.in('staff_id', selectedStaffIds);
      }

      const { data, error } = await query;
      if (error) throw error;
      console.log('Fetched appointments:', data);
      return data || [];
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Staff header */}
      <div className="flex items-center border-b bg-white sticky top-0 z-20">
        <div 
          className="flex-shrink-0 border-r bg-white" 
          style={{ width: TIME_COLUMN_WIDTH, minWidth: TIME_COLUMN_WIDTH }}
        />
        
        <div className="flex">
          {staffData?.map((staff) => (
            <StaffHeader
              key={staff.id}
              staff={staff}
              workingHours={workingHours?.find(wh => wh.is_open)}
            />
          ))}
        </div>
      </div>

      {/* Main calendar grid */}
      <div className="flex flex-1 border rounded-lg bg-white overflow-hidden">
        {/* Time column */}
        <div 
          className="flex-shrink-0 border-r bg-white z-10 relative" 
          style={{ width: TIME_COLUMN_WIDTH, minWidth: TIME_COLUMN_WIDTH }}
        >
          {hours.map((hour) => {
            // Create a Date object for the current hour in local time
            const timeForHour = new Date();
            timeForHour.setHours(hour, 0, 0, 0);
            
            return (
              <div
                key={hour}
                className="h-16 border-b text-sm text-muted-foreground relative"
              >
                <span className="absolute -top-3 right-4">
                  {format(timeForHour, 'h a')}
                </span>
              </div>
            );
          })}
          
          {/* Current time indicator */}
          {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
            <div 
              className="absolute left-0 right-0 z-20"
              style={{ top: `calc(${currentTimeTop}% - 12px)` }} // Adjust for bubble height
            >
              <div className="flex items-center">
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto mr-2">
                  {format(new Date(), 'h:mm a')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Staff columns with current time line */}
        <ScrollArea className="flex-1 relative">
          {/* Current time line overlay */}
          {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
            <div 
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{ top: `${currentTimeTop}%` }}
            >
              <div className="w-full h-px bg-red-500" />
            </div>
          )}
          
          <div className="flex">
            {staffData?.map((staff) => (
              <StaffColumn
                key={staff.id}
                staff={staff}
                appointments={appointments.filter(apt => apt.staff_id === staff.id)}
                currentDate={currentDate}
                currentTimeTop={currentTimeTop}
                dayStart={dayStart}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
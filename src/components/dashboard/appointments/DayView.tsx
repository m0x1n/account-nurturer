import React, { useEffect, useState, useRef } from "react";
import { format, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StaffHeader } from "./StaffHeader";
import { StaffColumn } from "./StaffColumn";
import { STAFF_COLUMN_WIDTH, TIME_COLUMN_WIDTH, SCROLL_BUTTON_WIDTH } from "./constants";

interface DayViewProps {
  currentDate: Date;
  selectedStaffIds?: string[];
}

export function DayView({ currentDate, selectedStaffIds = [] }: DayViewProps) {
  const [currentTimeTop, setCurrentTimeTop] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleStaffCount, setVisibleStaffCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayStart = startOfDay(currentDate);

  // Calculate visible staff count based on container width, accounting for time column
  useEffect(() => {
    const calculateVisibleStaff = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - (TIME_COLUMN_WIDTH + 2 * SCROLL_BUTTON_WIDTH);
        const newVisibleCount = Math.floor(containerWidth / STAFF_COLUMN_WIDTH);
        setVisibleStaffCount(Math.max(1, newVisibleCount));
      }
    };

    calculateVisibleStaff();
    window.addEventListener('resize', calculateVisibleStaff);
    return () => window.removeEventListener('resize', calculateVisibleStaff);
  }, []);

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

  // Fetch working hours for the current date
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
      return data || [];
    }
  });

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - STAFF_COLUMN_WIDTH));
  };

  const handleScrollRight = () => {
    const maxScroll = Math.max(0, (staffData?.length || 0) - visibleStaffCount) * STAFF_COLUMN_WIDTH;
    setScrollPosition(Math.min(maxScroll, scrollPosition + STAFF_COLUMN_WIDTH));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]" ref={containerRef}>
      {/* Staff header with scroll buttons */}
      <div className="flex items-center border-b bg-white sticky top-0 z-20">
        <div className="flex-shrink-0" style={{ width: TIME_COLUMN_WIDTH }} />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleScrollLeft}
          disabled={scrollPosition === 0}
          className="h-12"
          style={{ width: SCROLL_BUTTON_WIDTH }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex overflow-hidden">
          <div 
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {staffData?.map((staff) => (
              <StaffHeader
                key={staff.id}
                staff={staff}
                workingHours={workingHours?.find(wh => wh.is_open)}
              />
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleScrollRight}
          disabled={!staffData || scrollPosition >= (staffData.length - visibleStaffCount) * STAFF_COLUMN_WIDTH}
          className="h-12"
          style={{ width: SCROLL_BUTTON_WIDTH }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Main calendar grid */}
      <div className="flex flex-1 border rounded-lg bg-white overflow-hidden">
        {/* Time column */}
        <div 
          className="flex-shrink-0 border-r bg-white z-10" 
          style={{ width: TIME_COLUMN_WIDTH }}
        >
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
            {staffData?.map((staff) => (
              <StaffColumn
                key={staff.id}
                staff={staff}
                appointments={appointments || []}
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

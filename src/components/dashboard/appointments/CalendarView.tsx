import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarHeader } from "./CalendarHeader";
import { DayView } from "./DayView";
import { WeekView } from "./WeekView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

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

  return (
    <Card>
      <CardContent className="p-6">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          selectedStaffIds={selectedStaffIds}
          staffMembers={staffMembers || []}
          onDateChange={setCurrentDate}
          onViewChange={setView}
          onStaffChange={setSelectedStaffIds}
        />
        {view === "day" ? (
          <DayView
            currentDate={currentDate}
            selectedStaffIds={selectedStaffIds}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            selectedStaffId={selectedStaffIds[0]}
          />
        )}
      </CardContent>
    </Card>
  );
}
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

  const { data: staffMembers } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq('owner_id', user.id)
        .limit(1);

      if (!businesses?.length) return [];

      const { data, error } = await supabase
        .from("staff_members")
        .select("*")
        .eq('business_id', businesses[0].id);

      if (error) throw error;
      return data;
    }
  });

  const { data: appointments } = useQuery({
    queryKey: ["appointments", currentDate, view, selectedStaffIds],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq('owner_id', user.id)
        .limit(1);

      if (!businesses?.length) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          client:clients(first_name, last_name),
          service:services(name, price)
        `)
        .eq('business_id', businesses[0].id);

      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          selectedStaffIds={selectedStaffIds}
          onDateChange={setCurrentDate}
          onViewChange={setView}
          onStaffChange={setSelectedStaffIds}
          staffMembers={staffMembers || []}
        />
        {view === "day" ? (
          <DayView
            date={currentDate}
            appointments={appointments || []}
            staffMembers={staffMembers || []}
            selectedStaffIds={selectedStaffIds}
          />
        ) : (
          <WeekView
            startDate={currentDate}
            appointments={appointments || []}
            staffMember={staffMembers?.find(s => s.id === selectedStaffIds[0])}
          />
        )}
      </CardContent>
    </Card>
  );
}
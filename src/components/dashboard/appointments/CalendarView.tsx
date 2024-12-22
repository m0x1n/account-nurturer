import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarHeader } from "./CalendarHeader";
import { DayView } from "./DayView";
import { WeekView } from "./WeekView";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("day");

  return (
    <Card>
      <CardContent className="p-6">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onDateChange={setCurrentDate}
          onViewChange={setView}
        />
        {view === "day" ? (
          <DayView
            currentDate={currentDate}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
          />
        )}
      </CardContent>
    </Card>
  );
}
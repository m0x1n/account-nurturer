import React from "react";

interface DayViewProps {
  currentDate: Date;
  selectedStaffIds?: string[];
}

export function DayView({ currentDate, selectedStaffIds = [] }: DayViewProps) {
  return (
    <div>
      {/* New DayView implementation will go here */}
    </div>
  );
}

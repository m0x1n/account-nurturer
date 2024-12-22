import { addDays, format, isAfter } from "date-fns";
import { useState } from "react";
import { ScheduleDay } from "../../types/campaignTypes";

export const useScheduling = () => {
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date: format(date, "yyyy-MM-dd"),
      enabled: true,
      formatted: format(date, "EEEE (MMM d)"),
    };
  });

  const [scheduledDays, setScheduledDays] = useState<ScheduleDay[]>(nextSevenDays);

  const handleDayToggle = (index: number) => {
    setScheduledDays(days =>
      days.map((day, i) =>
        i === index ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const isBoostStillValid = () => {
    const lastDay = scheduledDays[scheduledDays.length - 1].date;
    return isAfter(new Date(lastDay), new Date());
  };

  return {
    scheduledDays,
    handleDayToggle,
    isBoostStillValid,
  };
};
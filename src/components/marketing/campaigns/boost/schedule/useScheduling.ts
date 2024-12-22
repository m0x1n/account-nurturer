import { useState } from "react";
import { addDays, format, isAfter, startOfDay } from "date-fns";

export const useScheduling = () => {
  const [scheduledDays, setScheduledDays] = useState(() => {
    const days = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      days.push({
        date: date.toISOString(),
        enabled: false,
        formatted: format(date, "EEEE, MMM d"),
      });
    }
    return days;
  });

  const handleDayToggle = (index: number) => {
    setScheduledDays((prevDays) =>
      prevDays.map((day, i) =>
        i === index ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const isBoostStillValid = () => {
    const enabledDays = scheduledDays.filter((day) => day.enabled);
    if (enabledDays.length === 0) return false;

    const lastDay = enabledDays
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return lastDay ? isAfter(new Date(lastDay.date), new Date()) : false;
  };

  return {
    scheduledDays,
    setScheduledDays,
    handleDayToggle,
    isBoostStillValid,
  };
};
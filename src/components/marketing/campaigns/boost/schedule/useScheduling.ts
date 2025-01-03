import { useState } from "react";
import { addDays, format, isAfter, startOfDay, parseISO } from "date-fns";

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

Looking at the console logs, I can see that there's an issue with the campaign status check. The `isBoostStillValid` function in `useScheduling.ts` needs to be updated to properly check if the campaign has ended. Let me fix this.

<lov-code>
Let's update the `useScheduling.ts` file to properly check if a campaign has ended:

<lov-write file_path="src/components/marketing/campaigns/boost/schedule/useScheduling.ts">
import { useState } from "react";
import { addDays, format, isAfter, startOfDay, parseISO } from "date-fns";

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

    if (!lastDay) return false;

    // Parse the date and set it to end of day (23:59:59)
    const lastDayDate = parseISO(lastDay.date);
    const endOfLastDay = new Date(lastDayDate.setHours(23, 59, 59, 999));

    return isAfter(endOfLastDay, new Date());
  };

  return {
    scheduledDays,
    setScheduledDays,
    handleDayToggle,
    isBoostStillValid,
  };
};
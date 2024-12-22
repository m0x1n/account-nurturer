import { format } from "date-fns";

export const calculateCurrentTimePosition = () => {
  const now = new Date();
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
  return (minutesSinceMidnight / (24 * 60)) * 100;
};

export const formatTimeLabel = (date: Date) => {
  return format(date, 'h:mm a');
};

export const createHourLabels = () => {
  const now = new Date();
  return Array.from({ length: 24 }, (_, hour) => {
    const date = new Date(now);
    date.setHours(hour, 0, 0, 0);
    return date;
  });
};
import { format } from "date-fns";

export const calculateCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Each hour slot is 64px tall (h-16 in Tailwind)
  // Convert current time to percentage of total day height
  return ((hours + minutes / 60) / 24) * 100;
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
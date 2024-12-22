import { format } from "date-fns";

export const calculateCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutesInDay = 24 * 60;
  const currentMinutes = (hours * 60) + minutes;
  
  return (currentMinutes / totalMinutesInDay) * 100;
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
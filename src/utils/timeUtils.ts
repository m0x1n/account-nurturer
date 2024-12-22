import { format } from "date-fns";

export const calculateCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Calculate percentage
  const percentage = ((hours + minutes / 60) / 24) * 100;
  
  // Debug logs
  console.log('Current local time:', format(now, 'h:mm a'));
  console.log('Hours:', hours, 'Minutes:', minutes);
  console.log('Calculated percentage:', percentage);
  console.log('This should position the line at approximately', Math.floor(percentage / 100 * 24), 'hours');
  
  return percentage;
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
import { format } from "date-fns";

export const calculateCurrentTimePosition = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Each hour block is 64px (h-16 = 4rem = 64px)
  // Calculate pixels from midnight
  const totalMinutesSinceMidnight = hours * 60 + minutes;
  const pixelsPerMinute = 64 / 60; // 64px per hour divided by 60 minutes
  const pixelPosition = totalMinutesSinceMidnight * pixelsPerMinute;
  
  // Debug logs
  console.log('Current local time:', format(now, 'h:mm a'));
  console.log('Hours:', hours, 'Minutes:', minutes);
  console.log('Pixels from midnight:', pixelPosition);
  console.log('This should position the line at approximately', Math.floor(pixelPosition / 64), 'hours');
  
  return pixelPosition;
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
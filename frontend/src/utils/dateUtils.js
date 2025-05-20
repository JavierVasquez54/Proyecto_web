// src/utils/dateUtils.js
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Format date as YYYY-MM-DD
export const formatDateForAPI = (date) => {
  return format(date, 'yyyy-MM-dd');
};

export const parseDateWithoutTimezone = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day); // mes en base 0
};

// Format date as readable string
export const formatReadableDate = (date) => {
  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
};

// Get array of next 8 days including today
export const getNext8Days = (startOffset = 0) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const days = [];
  
  for (let i = startOffset; i < startOffset + 8; i++) {
    const date = addDays(today, i);
    days.push({
      date,
      formattedDate: formatDateForAPI(date),
      readableDate: formatReadableDate(date),
      isToday: i === startOffset
    });
  }
  
  return days;
};
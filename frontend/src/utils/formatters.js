import { format, isPast, isToday, isTomorrow } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const getDueDateStatus = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  
  if (isPast(date) && !isToday(date)) return 'overdue';
  if (isToday(date)) return 'today';
  if (isTomorrow(date)) return 'tomorrow';
  
  return 'upcoming';
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

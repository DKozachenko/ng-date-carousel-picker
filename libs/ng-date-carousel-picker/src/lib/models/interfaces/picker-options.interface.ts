import { FirstDayOfWeek, IntRange, WeekdayOrder } from '../types';

export interface IPickerOptions {
  // 42 ширина дня
  scrollShift: IntRange<42, 300>;
  startDate: Date;
  endDate: Date;
  showCalendar: boolean;
  firstDayOfWeekIndex: FirstDayOfWeek;
  weekendIndexes: [WeekdayOrder, WeekdayOrder];
}

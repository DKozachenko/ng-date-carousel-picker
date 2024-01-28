import { IPickerOptions } from '../interfaces';

const now: Date = new Date();

export const DEFAULT_OPTIONS: IPickerOptions = {
  scrollShift: 150,
  startDate: now,
  endDate: new Date(new Date().setMonth(now.getMonth() + 3)),
  showCalendar: true,
  firstDayOfWeekIndex: 1,
  weekendIndexes: [0, 6],
};

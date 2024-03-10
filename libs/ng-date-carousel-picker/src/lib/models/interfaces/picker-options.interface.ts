import { FirstDayOfWeek, IntRange, WeekdayOrder } from '../types';

export interface IPickerOptions {
  /**
   * Distance (in px) which scrolls with button click. By default is `150`.
   *
   * Despite of having `DAY_WIDTH` constant I can't use it in generic, so a simple integer value is put here
   */
  scrollShift: IntRange<42, 300>;
  /** Date of period beginning. By default is current date. */
  startDate: Date;
  /** Date of period end. By default is exactly 3 months more than current date. */
  endDate: Date;
  /** Need to show calendar instead of scroll button in the end of period. By default is `true`. */
  showCalendar: boolean;
  /** Order (number) for first day of the week, `0` is for Sunday, `1` is for Monday. By default is `1`. */
  firstDayOfWeekIndex: FirstDayOfWeek;
  /** Numbers for weekend days. By default `[0, 6]`. */
  weekendIndexes: [WeekdayOrder, WeekdayOrder];
}

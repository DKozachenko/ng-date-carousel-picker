import { DayOrder, MonthOrder, WeekdayOrder } from '../types';

/** Range element */
export interface IRangeItem {
  /** Day number */
  day: DayOrder;
  /** Weekday number */
  weekday: WeekdayOrder;
  /** Month number */
  month: MonthOrder;
  year: number;
  /** Date in timestamp */
  timestamp: number;
}

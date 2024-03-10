import { DayOrder, WeekdayOrder } from '../types';

export interface IDay {
  id: string;
  /** Number */
  order: DayOrder;
  weekdayOrder: WeekdayOrder;
}

import { DayOrder, WeekdayOrder } from '../types';

/** День */
export interface IDay {
  /** Идентификатор */
  id: string;
  /** Номер */
  order: DayOrder;
  /** Номер дня недели */
  weekdayOrder: WeekdayOrder;
}

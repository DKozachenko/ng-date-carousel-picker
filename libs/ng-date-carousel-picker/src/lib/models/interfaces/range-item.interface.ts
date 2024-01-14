import { DayOrder, MonthOrder, WeekdayOrder } from '../types';

/** Элемент диапазона */
export interface IRangeItem {
  /** Номер дня */
  day: DayOrder;
  /** Номер для недели */
  weekday: WeekdayOrder;
  /** Номер месяца */
  month: MonthOrder;
  /** Год */
  year: number;
  /** Дата в timestamp */
  timestamp: number;
}

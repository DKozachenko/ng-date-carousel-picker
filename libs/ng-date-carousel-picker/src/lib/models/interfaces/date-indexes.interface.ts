import { MonthOrder, YearLimit } from '../types';

/** Индексы дат для календаря */
export interface IDateIndexes {
  /** Индекс месяца */
  monthIndex: MonthOrder;
  /** Индекс года */
  yearIndex: YearLimit | 4;
}

import { MonthOrder } from '../types';
import { IDay } from './day.interface';

/** Месяц */
export interface IMonth {
  /** Идентификатор */
  id: string;
  /** Номер */
  order: MonthOrder;
  /** Дни */
  days: IDay[];
}

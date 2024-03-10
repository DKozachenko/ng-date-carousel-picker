import { MonthOrder } from '../types';
import { IDay } from './day.interface';

export interface IMonth {
  id: string;
  /** Number */
  order: MonthOrder;
  days: IDay[];
}

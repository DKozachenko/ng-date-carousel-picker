import { IMonth } from './month.interface';

export interface IYear {
  id: string;
  /** Number */
  num: number;
  months: IMonth[];
}

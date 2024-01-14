import { IMonth } from './month.interface';

/** Год */
export interface IYear {
  /** Идентификатор */
  id: string;
  /** Номер */
  num: number;
  /** Месяцы */
  months: IMonth[];
}

import { IntRange, MonthLimit, YearLimit } from '../types';

/** Конфиг */
export interface IConfig {
  /** Расстояние для скролла */
  scrollShift: IntRange<30, 401>;
  /** Ограничение на кол-во отображаемых месяцев */
  monthLimit: MonthLimit;
  /** Ограничение на кол-во отображаемых годов в календаре */
  yearLimit: YearLimit;
}

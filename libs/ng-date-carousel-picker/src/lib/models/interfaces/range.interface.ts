import { IRangeItem } from './range-item.interface';

/** Диапазон */
export interface IRange {
  /** Начало */
  start: IRangeItem;
  /** Конец */
  end: IRangeItem;
}

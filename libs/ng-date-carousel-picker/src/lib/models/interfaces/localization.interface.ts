/**
 * Локализация (используется для названий месяцев и дней)
 * T - английское
 * R - русское
 */
export interface ILocalization<T, R> {
  /** Английское */
  eng: T;
  /** Русское */
  ru: R;
}
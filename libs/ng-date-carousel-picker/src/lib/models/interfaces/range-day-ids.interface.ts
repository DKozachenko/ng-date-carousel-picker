/** Идентификаторы дней диапазона */
export interface IRangeDayIds {
  /** Идентификатор дня в начале */
  startId: string;
  /** Идентификаторы дней в середине */
  inRangeIds: string[];
  /** Идентификатор дня в конце */
  endId: string;
}

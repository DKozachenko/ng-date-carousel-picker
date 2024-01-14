import { MonthOrder } from './month-order.type';

/** Ограничение на количество месяцев */
export type MonthLimit = Exclude<MonthOrder, 0>;

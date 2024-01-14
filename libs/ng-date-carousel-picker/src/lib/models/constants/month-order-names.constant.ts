import { ILocalization } from '../interfaces';
import { MonthEng, MonthOrder, MonthRu } from '../types';

/** Соответствие номера месяца и его названий */
export const monthOrderNames: Map<MonthOrder, ILocalization<MonthEng, MonthRu>> = new Map<
  MonthOrder,
  ILocalization<MonthEng, MonthRu>
>([
  [
    0,
    {
      eng: 'January',
      ru: 'Январь',
    },
  ],
  [
    1,
    {
      eng: 'February',
      ru: 'Февраль',
    },
  ],
  [
    2,
    {
      eng: 'March',
      ru: 'Март',
    },
  ],
  [
    3,
    {
      eng: 'April',
      ru: 'Апрель',
    },
  ],
  [
    4,
    {
      eng: 'May',
      ru: 'Май',
    },
  ],
  [
    5,
    {
      eng: 'June',
      ru: 'Июнь',
    },
  ],
  [
    6,
    {
      eng: 'July',
      ru: 'Июль',
    },
  ],
  [
    7,
    {
      eng: 'August',
      ru: 'Август',
    },
  ],
  [
    8,
    {
      eng: 'September',
      ru: 'Сентябрь',
    },
  ],
  [
    9,
    {
      eng: 'October',
      ru: 'Октябрь',
    },
  ],
  [
    10,
    {
      eng: 'November',
      ru: 'Ноябрь',
    },
  ],
  [
    11,
    {
      eng: 'December',
      ru: 'Декабрь',
    },
  ],
]);

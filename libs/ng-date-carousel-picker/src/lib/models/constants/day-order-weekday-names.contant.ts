import { ILocalization } from '../interfaces';
import { WeekdayEng, WeekdayOrder, WeekdayRu } from '../types';

/** Соответствие номера дня недели и его названий */
export const dayOrderWeekdayNames: Map<WeekdayOrder, ILocalization<WeekdayEng, WeekdayRu>> = new Map<
  WeekdayOrder,
  ILocalization<WeekdayEng, WeekdayRu>
>([
  [
    0,
    {
      eng: 'Sunday',
      ru: 'ВС',
    },
  ],
  [
    1,
    {
      eng: 'Monday',
      ru: 'ПН',
    },
  ],
  [
    2,
    {
      eng: 'Thuesday',
      ru: 'ВТ',
    },
  ],
  [
    3,
    {
      eng: 'Wednesday',
      ru: 'СР',
    },
  ],
  [
    4,
    {
      eng: 'Thursday',
      ru: 'ЧТ',
    },
  ],
  [
    5,
    {
      eng: 'Friday',
      ru: 'ПТ',
    },
  ],
  [
    6,
    {
      eng: 'Saturday',
      ru: 'СБ',
    },
  ],
]);

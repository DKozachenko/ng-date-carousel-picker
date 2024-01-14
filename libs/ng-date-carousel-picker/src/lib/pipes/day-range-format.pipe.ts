import { Pipe, PipeTransform } from '@angular/core';
import { IRange, IRangeItem } from '../models/interfaces';
import { formatDate, isRange } from '../utils';

/** Пайп для форматирования одной даты или диапазона дат */
@Pipe({
  name: 'rdpDayRangeFormat',
})
export class DayRangeFormatPipe implements PipeTransform {
  transform(value: IRange | IRangeItem): string {
    if (isRange(value)) {
      const startFormattedDate: string = formatDate(value.start);
      const endFormattedDate: string = formatDate(value.end);

      return `${startFormattedDate} - ${endFormattedDate}`;
    }
    return formatDate(value);
  }
}

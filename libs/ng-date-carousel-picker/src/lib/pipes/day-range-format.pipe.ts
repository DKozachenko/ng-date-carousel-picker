import { Pipe, PipeTransform, inject } from '@angular/core';
import { IRange, IRangeItem } from '../models/interfaces';
import { isRange } from '../utils';
import { InternalizationService } from '../services';

/** Pipe for formatting one date or range of dates */
@Pipe({
  name: 'dcpDayRangeFormat',
  standalone: true,
})
export class DayRangeFormatPipe implements PipeTransform {
  private readonly internalizationService: InternalizationService = inject(InternalizationService);

  transform(value: IRange | IRangeItem): string {
    if (isRange(value)) {
      const startDate: Date = new Date(value.start.year, value.start.month, value.start.day);
      const endDate: Date = new Date(value.end.year, value.end.month, value.end.day);

      const startFormattedDate: string = this.internalizationService.format(startDate);
      const endFormattedDate: string = this.internalizationService.format(endDate);

      return `${startFormattedDate} - ${endFormattedDate}`;
    }
    const date: Date = new Date(value.year, value.month, value.day);
    return this.internalizationService.format(date);
  }
}

import { Injectable, inject } from '@angular/core';
import { DCP_DATE_LOCALE } from '../tokens';
import { DayOrder, MonthOrder } from '../models/types';

@Injectable()
export class InternalizationService {
  /** Mock year for generation */
  private readonly yearForGeneration: number = 2017;

  /** Mock month for generation */
  private readonly monthForGeneration: MonthOrder = 0;

  /** Mock date for generation */
  private readonly dateForGeneration: DayOrder = 1;

  private readonly locale: string = inject(DCP_DATE_LOCALE);

  monthNames: string[] = [];
  weekdays: string[] = [];
  capitalizedWeekdays: string[] = [];
  capitalizedMonthNames: string[] = [];

  constructor() {
    this.setMonthNames();
    this.setWeekdays();
    this.capitalizedMonthNames = this.monthNames.map(
      (monthName: string) => monthName[0].toUpperCase() + monthName.slice(1),
    );
    this.capitalizedWeekdays = this.weekdays.map((weekday: string) => weekday[0].toUpperCase() + weekday.slice(1));
  }

  /**
   * Taken from
   * https://github.com/angular/components/blob/83b6ebcfc0dc8802c1f6d394ee6070204cc9b3f5/src/material/core/datetime/native-date-adapter.ts#L252
   */
  private formatIntlDateTime(dateTime: Intl.DateTimeFormat, date: Date): string {
    const newDate: Date = new Date();
    newDate.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    newDate.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    return dateTime.format(newDate);
  }

  /**
   * Taken from
   * https://github.com/angular/components/blob/83b6ebcfc0dc8802c1f6d394ee6070204cc9b3f5/src/material/core/datetime/native-date-adapter.ts#L21
   */
  private range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
      valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
  }

  /**
   * Similar to
   * https://github.com/angular/components/blob/83b6ebcfc0dc8802c1f6d394ee6070204cc9b3f5/src/material/core/datetime/native-date-adapter.ts#L71
   */
  private setMonthNames(): void {
    const dateTime: Intl.DateTimeFormat = new Intl.DateTimeFormat(this.locale, { month: 'long', timeZone: 'utc' });
    const valueFunction: (index: number) => string = (month: number) =>
      this.formatIntlDateTime(dateTime, new Date(this.yearForGeneration, month, this.dateForGeneration));
    this.monthNames = this.range<string>(12, valueFunction);
  }

  /**
   * Similar to
   * https://github.com/angular/components/blob/83b6ebcfc0dc8802c1f6d394ee6070204cc9b3f5/src/material/core/datetime/native-date-adapter.ts#L81
   */
  private setWeekdays(): void {
    const dateTime: Intl.DateTimeFormat = new Intl.DateTimeFormat(this.locale, { weekday: 'short', timeZone: 'utc' });
    const valueFunction: (index: number) => string = (day: number) =>
      this.formatIntlDateTime(dateTime, new Date(this.yearForGeneration, this.monthForGeneration, day + 1));
    this.weekdays = this.range(7, valueFunction);
  }

  public format(date: Date): string {
    return Intl.DateTimeFormat(this.locale).format(date);
  }
}

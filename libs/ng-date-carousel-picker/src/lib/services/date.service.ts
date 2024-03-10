import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IDay, IDayDate, IRange, IRangeDayIds, IRangeItem } from '../models/interfaces';
import { MonthOrder } from '../models/types';

/** Basic service for dates */
@Injectable()
export abstract class DateService {
  /** Dates of days (linear structure, each day has its own Date object) */
  protected readonly dayDates: IDayDate[] = [];

  protected selectedDay: IDay | null = null;

  /** Range Change Subscription */
  protected readonly rangeChanged$: Subject<IRange | IRangeItem> = new Subject<IRange | IRangeItem>();

  /** Range Change Subscription (public) */
  public readonly rangeChangedObs$: Observable<IRange | IRangeItem> = this.rangeChanged$.asObservable();

  /** Change Subscription */
  protected readonly changed$: Subject<IRange | IRangeItem | null> = new Subject<IRange | IRangeItem | null>();

  /** Change Subscription (public) */
  public readonly changedObs$: Observable<IRange | IRangeItem | null> = this.changed$.asObservable();

  /** Subscription to change selected days */
  protected readonly dayIdsChanged$: Subject<IRangeDayIds | string> = new Subject<IRangeDayIds | string>();

  /** Subscription to change selected days (public) */
  public readonly dayIdsChangedObs$: Observable<IRangeDayIds | string> = this.dayIdsChanged$.asObservable();

  protected abstract selectDay(day: IDay): void;
  protected abstract selectRange(secondDay: IDay): void;
  public abstract selectDate(day: IDay): void;

  /** Getting Ids of days in the middle of a range */
  protected getInRangeDayIds(startDayId: string, endDayId: string): string[] {
    const result: string[] = [];

    let isInRange: boolean = false;
    for (const dayDate of this.dayDates) {
      if (dayDate.dayId === startDayId) {
        isInRange = true;
        continue;
      }

      if (dayDate.dayId === endDayId) {
        isInRange = false;
        continue;
      }

      if (isInRange) {
        result.push(dayDate.dayId);
      }
    }

    return result;
  }

  protected getRangeItem(day: IDay): IRangeItem {
    const dayDate: IDayDate = <IDayDate>this.dayDates.find((item: IDayDate) => item.dayId === day.id);

    return {
      day: day.order,
      weekday: day.weekdayOrder,
      month: <MonthOrder>dayDate.date.getMonth(),
      year: dayDate.date.getFullYear(),
      timestamp: +dayDate.date,
    };
  }
}

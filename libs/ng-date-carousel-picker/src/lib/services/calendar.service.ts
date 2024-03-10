import { Injectable } from '@angular/core';
import { IDateIndexes, IDay, IDayDate, IMonth, IRange, IRangeDayIds, IRangeItem, IYear } from '../models/interfaces';
import { DayOrder, MonthOrder, WeekdayOrder } from '../models/types';
import { generateRandomString } from '../utils';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DateService } from './date.service';

@Injectable()
export class CalendarService extends DateService {
  /** Max year number (relatively current) */
  private readonly yearLimit: number = 2;

  private readonly years: IYear[] = [];

  /** Change subscription (internal) */
  private readonly changedInner$: Subject<IRange | IRangeItem | null> = new Subject<IRange | IRangeItem | null>();

  /** Change subscription */
  public readonly changedInnerObs$: Observable<IRange | IRangeItem | null> = this.changedInner$.asObservable();

  /** Subscription to change date indexes for a calendar */
  private readonly dateIndexes$: BehaviorSubject<IDateIndexes> = new BehaviorSubject<IDateIndexes>({
    monthIndex: 0,
    yearIndex: 0,
  });

  /** Subscription to change date indexes for the calendar (public) */
  public readonly dateIndexesObs$: Observable<IDateIndexes> = this.dateIndexes$.asObservable();

  /** Filling in years */
  private init(): void {
    const now: Date = new Date();
    const nowCounter: Date = new Date(new Date().setDate(1));
    const nowNYears: Date = new Date(
      new Date(
        new Date(
          new Date(new Date().setFullYear(now.getFullYear() + <number>(<number>this.yearLimit + 1))).setMonth(0),
        ),
      ).setDate(1),
    );

    while (+nowCounter < +nowNYears) {
      const day: IDay = {
        id: generateRandomString(),
        order: <DayOrder>nowCounter.getDate(),
        weekdayOrder: <WeekdayOrder>nowCounter.getDay(),
      };
      this.dayDates.push({
        dayId: day.id,
        date: new Date(new Date(nowCounter).setHours(0, 0, 0, 0)),
      });

      const currentYearNum: number = nowCounter.getFullYear();
      const currentMonthOrder: MonthOrder = <MonthOrder>nowCounter.getMonth();
      const existedYear: IYear | undefined = this.years.find((year: IYear) => year.num === currentYearNum);

      if (!existedYear) {
        this.years.push({
          id: generateRandomString(),
          num: currentYearNum,
          months: [
            {
              id: generateRandomString(),
              order: currentMonthOrder,
              days: [day],
            },
          ],
        });
      } else {
        const existedMonth: IMonth | undefined = existedYear.months.find(
          (month: IMonth) => month.order === currentMonthOrder,
        );

        if (!existedMonth) {
          existedYear.months.push({
            id: generateRandomString(),
            order: currentMonthOrder,
            days: [day],
          });
        } else {
          existedMonth.days.push(day);
        }
      }

      nowCounter.setDate(nowCounter.getDate() + 1);
    }
  }

  /** Select one day */
  protected selectDay(day: IDay): void {
    this.selectedDay = day;
    this.dayIdsChanged$.next(this.selectedDay.id);

    const item: IRangeItem = this.getRangeItem(this.selectedDay);
    this.changedInner$.next(item);
  }

  /** Range selection */
  protected selectRange(secondDay: IDay): void {
    let startItem!: IRangeItem;
    let endItem!: IRangeItem;
    let inRangeDayIds: string[] = [];
    let rangeDayIds!: IRangeDayIds;

    const firstDayDate: IDayDate = <IDayDate>(
      this.dayDates.find((item: IDayDate) => item.dayId === (<IDay>this.selectedDay).id)
    );
    const secondDayDate: IDayDate = <IDayDate>this.dayDates.find((item: IDayDate) => item.dayId === secondDay.id);

    // If the second selected day is later than the first
    if (+secondDayDate.date > +firstDayDate.date) {
      startItem = this.getRangeItem(<IDay>this.selectedDay);
      endItem = this.getRangeItem(secondDay);
      inRangeDayIds = this.getInRangeDayIds(firstDayDate.dayId, secondDayDate.dayId);
      rangeDayIds = {
        startId: firstDayDate.dayId,
        inRangeIds: inRangeDayIds,
        endId: secondDayDate.dayId,
      };
    } else {
      startItem = this.getRangeItem(secondDay);
      endItem = this.getRangeItem(<IDay>this.selectedDay);
      inRangeDayIds = this.getInRangeDayIds(secondDayDate.dayId, firstDayDate.dayId);
      rangeDayIds = {
        startId: secondDayDate.dayId,
        inRangeIds: inRangeDayIds,
        endId: firstDayDate.dayId,
      };
    }

    this.changedInner$.next({
      start: startItem,
      end: endItem,
    });

    this.dayIdsChanged$.next(rangeDayIds);
    this.selectedDay = null;
  }

  /** Getting a Date object by day Id */
  public getDateByDayId(dayId: string): Date {
    const dayDate: IDayDate = <IDayDate>this.dayDates.find((date: IDayDate) => date.dayId === dayId);
    return dayDate.date;
  }

  public selectDate(day: IDay): void {
    if (this.selectedDay?.id === day.id) {
      this.selectedDay = null;
      this.changedInner$.next(this.selectedDay);
      return;
    }

    if (this.selectedDay) {
      this.selectRange(day);
    } else {
      this.selectDay(day);
    }
  }

  public changeDateIndexes(indexes: IDateIndexes): void {
    this.dateIndexes$.next(indexes);
  }

  /** Change the selected date or date range */
  public change(value: IRange | IRangeItem): void {
    this.changed$.next(value);
  }

  public getYears(): IYear[] {
    if (this.years.length) {
      return this.years;
    }

    this.init();
    return this.years;
  }
}

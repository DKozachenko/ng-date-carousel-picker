import { Injectable } from '@angular/core';
import { IDateIndexes, IDay, IDayDate, IMonth, IRange, IRangeDayIds, IRangeItem, IYear } from '../models/interfaces';
import { DayOrder, MonthOrder, WeekdayOrder, YearLimit } from '../models/types';
import { generateRandomString } from '../utils';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DateService } from './date.service';

/** Сервис для календаря */
@Injectable()
export class CalendarService extends DateService {
  /** Годы */
  private readonly years: IYear[] = [];

  /** Подписка на изменение (внутренняя) */
  private readonly changedInner$: Subject<IRange | IRangeItem | null> = new Subject<IRange | IRangeItem | null>();

  /** Подписка на изменение */
  public readonly changedInnerObs$: Observable<IRange | IRangeItem | null> = this.changedInner$.asObservable();

  /** Подписка на изменение индексов дат для календаря */
  private readonly dateIndexes$: BehaviorSubject<IDateIndexes> = new BehaviorSubject<IDateIndexes>({
    monthIndex: 0,
    yearIndex: 0,
  });

  /** Подписка на изменение индексов дат для календаря (публичная) */
  public readonly dateIndexesObs$: Observable<IDateIndexes> = this.dateIndexes$.asObservable();

  /**
   * Заполнение годов
   * @param yearLimit ограничение по количеству годов (на сколько годов вперед нужно получить месяцы)
   */
  public init<YearLimit>(yearLimit: YearLimit): void {
    const now: Date = new Date();
    const nowCounter: Date = new Date(new Date().setDate(1));
    const nowNYears: Date = new Date(
      new Date(
        new Date(new Date(new Date().setFullYear(now.getFullYear() + <number>(<number>yearLimit + 1))).setMonth(0)),
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

  /**
   * Выбор одного дня
   * @param day день
   */
  protected selectDay(day: IDay): void {
    this.selectedDay = day;
    this.dayIdsChanged$.next(this.selectedDay.id);

    const item: IRangeItem = this.getRangeItem(this.selectedDay);
    this.changedInner$.next(item);
  }

  /**
   * Выбор диапазона
   * @param secondDay второй день в диапазоне
   */
  protected selectRange(secondDay: IDay): void {
    let startItem!: IRangeItem;
    let endItem!: IRangeItem;
    let inRangeDayIds: string[] = [];
    let rangeDayIds!: IRangeDayIds;

    const firstDayDate: IDayDate = <IDayDate>(
      this.dayDates.find((item: IDayDate) => item.dayId === (<IDay>this.selectedDay).id)
    );
    const secondDayDate: IDayDate = <IDayDate>this.dayDates.find((item: IDayDate) => item.dayId === secondDay.id);

    // Если второй выбранный день позже, чем первый
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

  /**
   * Получение объекта Date по идентификатору дня
   * @param dayId идентификатор дня
   * @returns Date
   */
  public getDateByDayId(dayId: string): Date {
    const dayDate: IDayDate = <IDayDate>this.dayDates.find((date: IDayDate) => date.dayId === dayId);
    return dayDate.date;
  }

  /**
   * Выбор даты
   * @param day день
   */
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

  /**
   * Измение выбранной даты или диапазона дат
   * @param value выбранная дата или диапазон дат
   */
  public change(value: IRange | IRangeItem): void {
    this.changed$.next(value);
  }

  /**
   * Получение годов
   * @param yearLimit ограничение по количеству годов в календаре (на сколько годов вперед нужно получить месяцы)
   * @returns
   */
  public getYears(yearLimit: YearLimit = 2): IYear[] {
    if (this.years.length) {
      return this.years;
    }

    this.init(yearLimit);
    return this.years;
  }
}

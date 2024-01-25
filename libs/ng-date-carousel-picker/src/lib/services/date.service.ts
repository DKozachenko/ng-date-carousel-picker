import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IDay, IDayDate, IRange, IRangeDayIds, IRangeItem } from '../models/interfaces';
import { MonthOrder } from '../models/types';

/** Базовый сервис для дат */
@Injectable()
export abstract class DateService {
  /** Даты дней (линейная структура, каждому дню соответствует его объект Date) */
  protected readonly dayDates: IDayDate[] = [];

  /** Выбранный день */
  protected selectedDay: IDay | null = null;

  /** Подписка на изменение диапазона */
  protected readonly rangeChanged$: Subject<IRange | IRangeItem> = new Subject<IRange | IRangeItem>();

  /** Подписка на изменение диапазона (публичная) */
  public readonly rangeChangedObs$: Observable<IRange | IRangeItem> = this.rangeChanged$.asObservable();

  /** Подписка на изменение */
  protected readonly changed$: Subject<IRange | IRangeItem | null> = new Subject<IRange | IRangeItem | null>();

  /** Подписка на изменение */
  public readonly changedObs$: Observable<IRange | IRangeItem | null> = this.changed$.asObservable();

  /** Подписка на изменение выбранных дней */
  protected readonly dayIdsChanged$: Subject<IRangeDayIds | string> = new Subject<IRangeDayIds | string>();

  /** Подписка на изменение выбранных дней (публичная) */
  public readonly dayIdsChangedObs$: Observable<IRangeDayIds | string> = this.dayIdsChanged$.asObservable();

  // protected abstract init(limit: any): void;
  protected abstract selectDay(day: IDay): void;
  protected abstract selectRange(secondDay: IDay): void;
  public abstract selectDate(day: IDay): void;

  /**
   * Получение идентификаторов дней в середине диапазона
   * @param startDayId идентификатор дня в начале диапазоне
   * @param endDayId идентификатор дня в конце диапазоне
   * @returns массив идентификаторов
   */
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

  /**
   * Получение элемента диапазона
   * @param day день
   * @returns элемент диапазона
   */
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

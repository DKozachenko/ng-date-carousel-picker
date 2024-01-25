import { Injectable } from '@angular/core';
import { IDayDate, IDay, IMonth, IRangeDayIds, IRangeItem } from '../models/interfaces';
import { DayOrder, MonthOrder, WeekdayOrder } from '../models/types';
import { generateRandomString } from '../utils';
import { DateService } from './date.service';

/** Сервис для пикера */
@Injectable()
export class PickerService extends DateService {
  /** Месяцы (вложенная структура, каждый месяц содержит свои дни) */
  private readonly months: IMonth[] = [];

  /**
   * Заполнение месяцев
   * @param monthLimit ограничение по количеству месяцев (на сколько месяцев вперед нужно получить дни)
   */
  protected init(startDate: Date, endDate: Date): void {
    const startDateCounter: Date = startDate;

    while (+startDateCounter < +endDate) {
      const day: IDay = {
        id: generateRandomString(),
        order: <DayOrder>startDateCounter.getDate(),
        weekdayOrder: <WeekdayOrder>startDateCounter.getDay(),
      };
      this.dayDates.push({
        dayId: day.id,
        date: new Date(new Date(startDateCounter).setHours(0, 0, 0, 0)),
      });

      const currentMonthOrder: MonthOrder = <MonthOrder>startDateCounter.getMonth();
      const existedMonth: IMonth | undefined = this.months.find((month: IMonth) => month.order === currentMonthOrder);

      if (!existedMonth) {
        this.months.push({
          id: generateRandomString(),
          order: currentMonthOrder,
          days: [day],
        });
      } else {
        existedMonth.days.push(day);
      }

      startDateCounter.setDate(startDateCounter.getDate() + 1);
    }
  }
  /**
   * Получение месяца по идентификатору дня, который есть в этом месяце
   * @param dayId
   * @returns
   */
  private getMonthByDayId(dayId: string): IMonth {
    const month: IMonth = <IMonth>(
      this.months.find((month: IMonth) => !!month.days.find((day: IDay) => day.id === dayId))
    );
    return month;
  }

  /**
   * Выбор одного дня
   * @param day день
   */
  protected selectDay(day: IDay): void {
    this.selectedDay = day;
    this.dayIdsChanged$.next(this.selectedDay.id);

    const item: IRangeItem = this.getRangeItem(this.selectedDay);
    this.rangeChanged$.next(item);
    this.changed$.next(item);
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

    this.rangeChanged$.next({
      start: startItem,
      end: endItem,
    });
    this.changed$.next({
      start: startItem,
      end: endItem,
    });

    this.dayIdsChanged$.next(rangeDayIds);
    this.selectedDay = null;
  }

  /**
   * Выбор даты
   * @param day день
   */
  public selectDate(day: IDay): void {
    if (this.selectedDay?.id === day.id) {
      this.selectedDay = null;
      this.changed$.next(this.selectedDay);
      return;
    }

    if (this.selectedDay) {
      this.selectRange(day);
    } else {
      this.selectDay(day);
    }
  }

  public getMonths(startDate: Date, endDate: Date): IMonth[] {
    if (this.months.length) {
      return this.months;
    }

    this.init(startDate, endDate);
    return this.months;
  }
}

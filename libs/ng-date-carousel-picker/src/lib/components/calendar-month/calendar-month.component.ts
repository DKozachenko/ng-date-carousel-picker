import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  QueryList,
  SkipSelf,
  ViewChildren,
  inject,
} from '@angular/core';
import { IDay, IMonth, IRangeDayIds } from '../../models/interfaces';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';
import { NgForOf } from '@angular/common';

/** Компонент месяца календаря */
@Component({
  selector: 'dcp-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [NgForOf, CalendarDayComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthComponent implements AfterViewInit {
  /** Компоненты дней */
  @ViewChildren(CalendarDayComponent) private readonly dayComponents!: QueryList<CalendarDayComponent>;

  /** Месяц */
  @Input({ required: true }) public month!: IMonth;

  // Для обновления состояний дней используется именно родительский ChangeDetectorRef
  // из-за специфики работы HostBinding, описанной тут https://github.com/angular/angular/issues/22560
  @SkipSelf() private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngAfterViewInit(): void {
    this.setFirstDayGridColumnStart();
  }

  /** Установка значения `grid-column-start` для первого дня месяца */
  private setFirstDayGridColumnStart(): void {
    const firstMonthDay: CalendarDayComponent = <CalendarDayComponent>this.dayComponents.get(0);
    firstMonthDay.setGridColumnStart();
  }

  /**
   * Обновление состояний нахождения в диапазоне у дней
   * @param rangeIds идентификаторы дней диапазона
   */
  public updateDaysRangeState(rangeIds: IRangeDayIds): void {
    for (const calendarDay of this.dayComponents) {
      calendarDay.inRangeStart = calendarDay.day.id === rangeIds.startId;
      calendarDay.inRangeMiddle = rangeIds.inRangeIds.includes(calendarDay.day.id);
      calendarDay.inRangeEnd = calendarDay.day.id === rangeIds.endId;
      this.cdr.detectChanges();
    }
  }

  /**
   * Обновление состояния выбора у одного дня
   * @param selectedDayId идентификатор выбранного дня
   */
  public updateDaySelection(selectedDayId: string): void {
    for (const calendarDay of this.dayComponents) {
      calendarDay.selected = calendarDay.day.id === selectedDayId;
      calendarDay.inRangeStart = false;
      calendarDay.inRangeMiddle = false;
      calendarDay.inRangeEnd = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Функция trackBy для списка дней
   * @param index индекс
   * @param day день
   * @returns идентификатор дня
   */
  public trackByDayId(index: number, day: IDay): string {
    return day.id;
  }
}

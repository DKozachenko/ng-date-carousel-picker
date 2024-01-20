import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CalendarService, InternalizationService } from '../../services';
import { IConfig, IDateIndexes, IMonth, IRange, IRangeItem, IYear } from '../../models/interfaces';
import { MonthOrder, YearLimit } from '../../models/types';
import { PICKER_CONFIG } from '../../models/constants';
import { CalendarMonthsTrackComponent } from '../calendar-months-track/calendar-months-track.component';
import { NgForOf, NgIf } from '@angular/common';
import { DayRangeFormatPipe } from '../../pipes';

/** Компонент календаря */
@UntilDestroy()
@Component({
  selector: 'dcp-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [NgIf, NgForOf, DayRangeFormatPipe, CalendarMonthsTrackComponent],
  standalone: true,
  providers: [InternalizationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  /** Эмиттер события закрытия */
  @Output() private readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /** Года */
  public years: IYear[] = [];

  /** Дни недели (русские названия) */
  public weekdays: string[] = [];

  /** Текущий месяц */
  public currentMonth!: IMonth;

  /** Текущий индекс месяца */
  public currentMonthIndex: MonthOrder = 0;

  public currentMonthName: string = '';

  /** Текущий индекс года */
  public currentYearIndex: YearLimit | 4 = 0;

  /** Текущий номер года */
  public currentYearNum: number = 0;

  /** Информация о выбранной дате или диапазоне дат */
  public dateInfo: IRange | IRangeItem | null = null;

  /** Недоступен ли левый контрол */
  public isLeftControlDisabled: boolean = true;

  /** Недоступен ли правый контрол */
  public isRightControlDisabled: boolean = false;

  private readonly calendarService: CalendarService = inject(CalendarService);
  private readonly internalizationService: InternalizationService = inject(InternalizationService);
  // private readonly config: IConfig = inject(PICKER_CONFIG);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.years = this.calendarService.getYears(1);
    this.initWeekdays();

    this.calendarService.dateIndexesObs$.pipe(untilDestroyed(this)).subscribe((indexes: IDateIndexes) => {
      this.currentMonthIndex = indexes.monthIndex;
      this.currentYearIndex = indexes.yearIndex;

      this.isLeftControlDisabled = this.currentYearIndex === 0 && this.currentMonthIndex === 0;
      this.isRightControlDisabled =
        this.currentYearIndex === this.years.length - 1 &&
        this.currentMonthIndex === this.years[this.currentYearIndex].months.length - 1;

      this.setCurrentMonthYear();
    });

    this.calendarService.changedInnerObs$.pipe(untilDestroyed(this)).subscribe((data: IRange | IRangeItem | null) => {
      this.dateInfo = data;
      this.cdr.detectChanges();
    });
  }

  /** Инициализация дней недели */
  private initWeekdays(): void {
    for (let i = 1; i < 7; ++i) {
      const weekday: string = this.internalizationService.capitalizedWeekdays[i];
      this.weekdays.push(weekday);
    }

    const firstWeekday: string = this.internalizationService.capitalizedWeekdays[0];
    this.weekdays.push(firstWeekday);
  }

  /** Установка текущего месяца, его названия и номера года */
  private setCurrentMonthYear(): void {
    this.currentMonth = this.years[this.currentYearIndex].months[this.currentMonthIndex];

    const monthName: string = this.internalizationService.capitalizedMonthNames[this.currentMonth.order];
    this.currentMonthName = monthName;

    this.currentYearNum = this.years[this.currentYearIndex].num;
  }

  /** Установка следюущиего месяца */
  public setNextMonth(): void {
    if (this.currentMonth.order === 11) {
      this.calendarService.changeDateIndexes({
        monthIndex: 0,
        yearIndex: <YearLimit | 4>(this.currentYearIndex + 1),
      });
    } else {
      this.calendarService.changeDateIndexes({
        monthIndex: <MonthOrder>(this.currentMonthIndex + 1),
        yearIndex: this.currentYearIndex,
      });
    }
  }

  /** Устновка предыдущего месяца */
  public setPrevMonth(): void {
    if (this.currentMonth.order === 0) {
      const newMonthIndex: MonthOrder = <MonthOrder>(this.years[this.currentYearIndex - 1].months.length - 1);
      this.calendarService.changeDateIndexes({
        monthIndex: newMonthIndex,
        yearIndex: <YearLimit | 4>(this.currentYearIndex - 1),
      });
    } else {
      this.calendarService.changeDateIndexes({
        monthIndex: <MonthOrder>(this.currentMonthIndex - 1),
        yearIndex: this.currentYearIndex,
      });
    }
  }

  /** Закрытие */
  public close(): void {
    this.closed.emit();
  }

  /** Выбор одной даты или диапазона */
  public select(): void {
    this.calendarService.change(<IRange | IRangeItem>this.dateInfo);
    this.close();
  }

  /**
   * Функция trackBy для отслеживания по индексу
   * @param index index
   * @returns индекс
   */
  public trackByIndex(index: number): number {
    return index;
  }
}

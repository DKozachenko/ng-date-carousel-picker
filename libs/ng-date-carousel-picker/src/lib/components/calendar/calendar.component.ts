import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PopoverClose } from '@ngx-popovers/popover';
import { CalendarService, InternalizationService, OptionsService } from '../../services';
import { IDateIndexes, IMonth, IRange, IRangeItem, IYear } from '../../models/interfaces';
import { MonthOrder, WeekdayOrder } from '../../models/types';
import { CalendarMonthsTrackComponent } from '../calendar-months-track/calendar-months-track.component';
import { DayRangeFormatPipe } from '../../pipes';

@UntilDestroy()
@Component({
  selector: 'dcp-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [NgIf, NgForOf, DayRangeFormatPipe, CalendarMonthsTrackComponent, PopoverClose],
  standalone: true,
  providers: [InternalizationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  public years: IYear[] = [];

  public weekdays: string[] = [];

  public currentMonth!: IMonth;
  public currentMonthIndex: MonthOrder = 0;
  public currentMonthName: string = '';

  /** Current year index */
  public currentYearIndex: number = 0;

  /** Current year number */
  public currentYearNum: number = 0;

  /** Information about the selected date or date range */
  public dateInfo: IRange | IRangeItem | null = null;

  public isLeftControlDisabled: boolean = true;
  public isRightControlDisabled: boolean = false;

  private readonly calendarService: CalendarService = inject(CalendarService);
  private readonly optionsService: OptionsService = inject(OptionsService);
  private readonly internalizationService: InternalizationService = inject(InternalizationService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.years = this.calendarService.getYears();
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

  private initWeekdays(): void {
    for (let i = 1; i < 7; ++i) {
      const weekday: string = this.internalizationService.capitalizedWeekdays[i];
      this.weekdays.push(weekday);
    }
    const firstWeekday: string = this.internalizationService.capitalizedWeekdays[0];

    if (this.optionsService.getOptions().firstDayOfWeekIndex === 1) {
      this.weekdays.push(firstWeekday);
    } else {
      this.weekdays.unshift(firstWeekday);
    }
  }

  /** Setting the current month, its name and year number */
  private setCurrentMonthYear(): void {
    this.currentMonth = this.years[this.currentYearIndex].months[this.currentMonthIndex];

    const monthName: string = this.internalizationService.capitalizedMonthNames[this.currentMonth.order];
    this.currentMonthName = monthName;

    this.currentYearNum = this.years[this.currentYearIndex].num;
  }

  /** Setting next month */
  public setNextMonth(): void {
    if (this.currentMonth.order === 11) {
      this.calendarService.changeDateIndexes({
        monthIndex: 0,
        yearIndex: this.currentYearIndex + 1,
      });
    } else {
      this.calendarService.changeDateIndexes({
        monthIndex: <MonthOrder>(this.currentMonthIndex + 1),
        yearIndex: this.currentYearIndex,
      });
    }
  }

  /** Setting previous month */
  public setPrevMonth(): void {
    if (this.currentMonth.order === 0) {
      const newMonthIndex: MonthOrder = <MonthOrder>(this.years[this.currentYearIndex - 1].months.length - 1);
      this.calendarService.changeDateIndexes({
        monthIndex: newMonthIndex,
        yearIndex: this.currentYearIndex - 1,
      });
    } else {
      this.calendarService.changeDateIndexes({
        monthIndex: <MonthOrder>(this.currentMonthIndex - 1),
        yearIndex: this.currentYearIndex,
      });
    }
  }

  /** Select one date or range */
  public select(): void {
    this.calendarService.change(<IRange | IRangeItem>this.dateInfo);
  }

  public trackByIndex(index: number): number {
    return index;
  }

  public isWeekend(index: number): boolean {
    if (this.optionsService.getOptions().firstDayOfWeekIndex === 1) {
      const weekday: string = <string>this.weekdays.find((_, ind) => ind === index);
      // factIndex is not index in `weekends` property
      const factIndex: WeekdayOrder = <WeekdayOrder>(
        this.internalizationService.capitalizedWeekdays.findIndex((item: string) => item === weekday)
      );
      return this.optionsService.getOptions().weekendIndexes.includes(factIndex);
    }
    return this.optionsService.getOptions().weekendIndexes.includes(<WeekdayOrder>index);
  }
}

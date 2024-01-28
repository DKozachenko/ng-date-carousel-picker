import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { PopoverComponent, PopoverTemplate } from '@ngx-popovers/popover';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CalendarService, OptionsService, PickerService } from '../../services';
import { IMonth, IPickerOptions, IRange, IRangeItem } from '../../models/interfaces';
import { MonthNamesTrackComponent } from '../month-names-track/month-names-track.component';
import { DaysTrackComponent } from '../days-track/days-track.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { DEFAULT_OPTIONS } from '../../models/constants';
import { FirstDayOfWeek, IntRange, RightControl, WeekdayOrder } from '../../models/types';
import { PopoverConfigProvider } from './providers';

/** Компонент дата пикера */
@UntilDestroy()
@Component({
  selector: 'ng-date-carousel-picker',
  templateUrl: './date-carousel-picker.component.html',
  styleUrls: ['./date-carousel-picker.component.scss'],
  imports: [NgIf, MonthNamesTrackComponent, DaysTrackComponent, CalendarComponent, PopoverComponent, PopoverTemplate],
  providers: [PickerService, CalendarService, OptionsService, PopoverConfigProvider],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // For vars
  encapsulation: ViewEncapsulation.None,
})
export class DateCarouselPickerComponent implements OnInit, IPickerOptions {
  @Input({ required: false }) public readonly scrollShift: IntRange<42, 300> = DEFAULT_OPTIONS['scrollShift'];
  @Input({ required: false }) public readonly startDate: Date = DEFAULT_OPTIONS['startDate'];
  @Input({ required: false }) public readonly endDate: Date = DEFAULT_OPTIONS['endDate'];
  @Input({ required: false }) public readonly showCalendar: boolean = DEFAULT_OPTIONS['showCalendar'];
  @Input({ required: false }) public readonly firstDayOfWeekIndex: FirstDayOfWeek =
    DEFAULT_OPTIONS['firstDayOfWeekIndex'];
  @Input({ required: false }) public readonly weekendIndexes: [WeekdayOrder, WeekdayOrder] =
    DEFAULT_OPTIONS['weekendIndexes'];

  /** Компонент трека названий месяцев */
  @ViewChild(MonthNamesTrackComponent) private readonly monthNamesTrackComponent!: MonthNamesTrackComponent;

  /** Компонент трека дней */
  @ViewChild(DaysTrackComponent) private readonly daysTrackComponent!: DaysTrackComponent;

  /** Эмиттер изменения выбора дат */
  @Output() private readonly changed: EventEmitter<IRange | IRangeItem | null> = new EventEmitter<
    IRange | IRangeItem | null
  >();

  /** Месяцы */
  public months: IMonth[] = [];

  /** Недоступен ли левый контрол */
  public isLeftControlDisabled: boolean = true;
  public isRightControlDisabled: boolean = false;

  /** Тип правого контрола */
  public rightControlType: RightControl = 'scroll-button';

  private readonly pickerService: PickerService = inject(PickerService);
  private readonly calendarService: CalendarService = inject(CalendarService);
  private readonly optionsService: OptionsService = inject(OptionsService);

  public ngOnInit(): void {
    if (this.startDate >= this.endDate) {
      throw new Error(`'startDate' (${this.startDate}) can't be more or equal than 'endDate' (${this.endDate})`);
    }

    this.optionsService.setOptions({
      scrollShift: this.scrollShift,
      startDate: this.startDate,
      endDate: this.endDate,
      showCalendar: this.showCalendar,
      firstDayOfWeekIndex: this.firstDayOfWeekIndex,
      weekendIndexes: this.weekendIndexes,
    });

    this.months = this.pickerService.getMonths(this.startDate, this.endDate);

    this.pickerService.changedObs$
      .pipe(untilDestroyed(this))
      .subscribe((data: IRange | IRangeItem | null) => this.changed.emit(data));

    this.calendarService.changedObs$
      .pipe(untilDestroyed(this))
      .subscribe((data: IRange | IRangeItem | null) => this.changed.emit(data));
  }

  /**
   * Происходит ли выход за левую границу вьюпорта
   * @param currentDaysScrollerLeft текущее значение `left` у скроллера
   */
  private isGoingBeyondViewportLeftBorder(currentDaysScrollerLeft: number): boolean {
    /**
     * Скроллер располагается относительно левого края вьюпорта, его начальное значение `left`
     * равно 0, при дальнейшем скролле вправо значение свойства уменьшается и становится отрицательным,
     * соответственно если в какой-то момент времени значение будет больше 0, это говорит о
     * о выходе за левую границу вьюпорта
     */
    return currentDaysScrollerLeft + this.scrollShift >= 0;
  }

  /**
   * Происходит ли выход за правую границу вьюпорта
   * @param currentDaysScrollerLeft текущее значение `left` у скроллера
   */
  private isGoingBeyondViewportRightBorder(currentDaysScrollerLeft: number): boolean {
    const daysViewportWidth: number = this.daysTrackComponent.getViewportWidth();
    const daysScrollerScrollWidth: number = this.daysTrackComponent.getScrollerScrollWidth();

    /**
     * Скроллер располагается относительно левого края вьюпорта, его начальное значение `left`
     * равно 0, при дальнейшем скролле вправо значение свойства уменьшается и становится отрицательным,
     * поэтому по факту, сколько проскроллено равно `-currentDaysScrollerLeft`, если к этому прибавить ширину вьюпорта
     * и значение скролла и оно будет превалировать над всей скроллируемой шириной скроллера, это говорит о
     * выходе за правую границу вьюпорта
     */
    return -currentDaysScrollerLeft + daysViewportWidth + this.scrollShift >= daysScrollerScrollWidth;
  }

  /** Скролл влево */
  public scrollLeft(): void {
    const currentDaysScrollerLeft: number = this.daysTrackComponent.getScrollerLeft();

    if (this.isGoingBeyondViewportLeftBorder(currentDaysScrollerLeft)) {
      this.daysTrackComponent.setScrollerLeft(0);
      this.monthNamesTrackComponent.setScrollerLeft(0);
      this.isLeftControlDisabled = true;

      this.monthNamesTrackComponent.setNameComponentStartLeft();
    } else {
      const newLeftValue: number = currentDaysScrollerLeft + this.scrollShift;
      this.daysTrackComponent.setScrollerLeft(newLeftValue);
      this.rightControlType = 'scroll-button';
      this.isRightControlDisabled = false;

      this.monthNamesTrackComponent.scrollLeft(newLeftValue);
    }
  }

  /** Скролл вправо */
  public scrollRight(): void {
    const currentDaysScrollerLeft: number = this.daysTrackComponent.getScrollerLeft();

    if (this.isGoingBeyondViewportRightBorder(currentDaysScrollerLeft)) {
      const daysViewportWidth: number = this.daysTrackComponent.getViewportWidth();
      const daysScrollerScrollWidth: number = this.daysTrackComponent.getScrollerScrollWidth();

      const newLeftValue: number = daysScrollerScrollWidth - daysViewportWidth;
      this.daysTrackComponent.setScrollerLeft(-newLeftValue);
      this.monthNamesTrackComponent.setScrollerLeft(-newLeftValue);

      this.isRightControlDisabled = true;
      this.rightControlType = 'calendar-button';

      this.monthNamesTrackComponent.setNameComponentEndLeft(newLeftValue);
    } else {
      const newLeftValue: number = currentDaysScrollerLeft - this.scrollShift;
      this.daysTrackComponent.setScrollerLeft(newLeftValue);
      this.isLeftControlDisabled = false;

      this.monthNamesTrackComponent.scrollRight(newLeftValue);
    }
  }
}

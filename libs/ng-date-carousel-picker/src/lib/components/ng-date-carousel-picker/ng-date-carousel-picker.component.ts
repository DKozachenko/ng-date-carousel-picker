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

@UntilDestroy()
@Component({
  /* eslint-disable-next-line @angular-eslint/component-selector */
  selector: 'ng-date-carousel-picker',
  templateUrl: './ng-date-carousel-picker.component.html',
  styleUrls: ['./ng-date-carousel-picker.component.scss'],
  imports: [NgIf, MonthNamesTrackComponent, DaysTrackComponent, CalendarComponent, PopoverComponent, PopoverTemplate],
  providers: [PickerService, CalendarService, OptionsService, PopoverConfigProvider],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  /** Used to allow styling via css variables */
  encapsulation: ViewEncapsulation.None,
})
export class NgDateCarouselPickerComponent implements OnInit, IPickerOptions {
  /** Distance (in px) which scrolls with button click. By default is `150`. */
  @Input({ required: false }) public readonly scrollShift: IntRange<42, 300> = DEFAULT_OPTIONS['scrollShift'];

  /** Date of period beginning. By default is current date. */
  @Input({ required: false }) public readonly startDate: Date = DEFAULT_OPTIONS['startDate'];

  /** Date of period end. By default is exactly 3 months more than current date. */
  @Input({ required: false }) public readonly endDate: Date = DEFAULT_OPTIONS['endDate'];

  /** Need to show calendar instead of scroll button in the end of period. By default is `true`. */
  @Input({ required: false }) public readonly showCalendar: boolean = DEFAULT_OPTIONS['showCalendar'];

  /** Order (number) for first day of the week, `0` is for Sunday, `1` is for Monday. By default is `1`. */
  @Input({ required: false }) public readonly firstDayOfWeekIndex: FirstDayOfWeek =
    DEFAULT_OPTIONS['firstDayOfWeekIndex'];

  /** Numbers for weekend days. By default `[0, 6]`. */
  @Input({ required: false }) public readonly weekendIndexes: [WeekdayOrder, WeekdayOrder] =
    DEFAULT_OPTIONS['weekendIndexes'];

  @ViewChild(MonthNamesTrackComponent) private readonly monthNamesTrackComponent!: MonthNamesTrackComponent;
  @ViewChild(DaysTrackComponent) private readonly daysTrackComponent!: DaysTrackComponent;

  @Output() private readonly changed: EventEmitter<IRange | IRangeItem | null> = new EventEmitter<
    IRange | IRangeItem | null
  >();

  public months: IMonth[] = [];

  public isLeftControlDisabled: boolean = true;
  public isRightControlDisabled: boolean = false;

  public rightControlType: RightControl = 'scroll-button';

  private readonly pickerService: PickerService = inject(PickerService);
  private readonly calendarService: CalendarService = inject(CalendarService);
  private readonly optionsService: OptionsService = inject(OptionsService);

  public ngOnInit(): void {
    if (this.startDate >= this.endDate) {
      throw new Error(`'startDate' (${this.startDate}) can't be more or equal than 'endDate' (${this.endDate})`);
    }

    if (this.monthDiff(this.startDate, this.endDate) < 1) {
      throw new Error(
        `Between 'startDate' (${this.startDate}) and 'endDate' (${this.endDate}) must be at least one month`,
      );
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
   * Taken from
   * https://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript
   */
  private monthDiff(date1: Date, date2: Date): number {
    let monthsNumber = (date2.getFullYear() - date1.getFullYear()) * 12;
    monthsNumber -= date1.getMonth();
    monthsNumber += date2.getMonth();
    return monthsNumber <= 0 ? 0 : monthsNumber;
  }

  /** Does it go beyond the left border of the viewport */
  private isGoingBeyondViewportLeftBorder(currentDaysScrollerLeft: number): boolean {
    /**
     * The scroller is positioned relative to the left edge of the viewport, its initial value is `left`
     * is equal to 0, with further scrolling to the right the property value decreases and becomes negative,
     * accordingly, if at some point in time the value is greater than 0, this indicates
     * about going beyond the left border of the viewport
     */
    return currentDaysScrollerLeft + this.scrollShift >= 0;
  }

  /** Does it go beyond the right border of the viewport */
  private isGoingBeyondViewportRightBorder(currentDaysScrollerLeft: number): boolean {
    const daysViewportWidth: number = this.daysTrackComponent.getViewportWidth();
    const daysScrollerScrollWidth: number = this.daysTrackComponent.getScrollerScrollWidth();

    /**
     * The scroller is positioned relative to the left edge of the viewport, its initial value is `left`
     * is equal to 0, with further scrolling to the right the property value decreases and becomes negative,
     * therefore, in fact, how much scrolling is equal to `-currentDaysScrollerLeft`, if you add the width of the viewport to this
     * and the scroll value and it will prevail over the entire scrollable width of the scroller, this indicates
     * going beyond the right border of the viewport
     */
    return -currentDaysScrollerLeft + daysViewportWidth + this.scrollShift >= daysScrollerScrollWidth;
  }

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

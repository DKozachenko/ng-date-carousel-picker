import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { IDay } from '../../models/interfaces';
import { WeekdayOrder } from '../../models/types';
import { CalendarService, OptionsService } from '../../services';

@Component({
  selector: 'dcp-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent implements OnInit {
  @Input({ required: true }) public day!: IDay;

  @HostBinding('class.disabled') public disabled: boolean = false;

  /** Is it at the beginning of the week */
  @HostBinding('class.in_week_start') public inWeekStart: boolean = false;

  /** Is it at the end of the week */
  @HostBinding('class.in_week_end') public inWeekEnd: boolean = false;

  @HostBinding('class.selected') public selected: boolean = false;

  /** Is it at the beginning of the range */
  @HostBinding('class.in_range_middle') public inRangeMiddle: boolean = false;

  /** Is it in the middle of the range */
  @HostBinding('class.in_range_start') public inRangeStart: boolean = false;

  /** Is at the end of the range */
  @HostBinding('class.in_range_end') public inRangeEnd: boolean = false;

  private readonly calendarService: CalendarService = inject(CalendarService);
  private readonly optionsService: OptionsService = inject(OptionsService);
  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  public ngOnInit(): void {
    if (this.optionsService.getOptions().firstDayOfWeekIndex === 1) {
      // 0 is for Sunday, 1 is for Monday
      this.inWeekStart = this.day.weekdayOrder === 1;
      this.inWeekEnd = this.day.weekdayOrder === 0;
    } else {
      this.inWeekStart = this.day.weekdayOrder === 0;
      this.inWeekEnd = this.day.weekdayOrder === 6;
    }

    const nowDay: Date = new Date(new Date().setHours(0, 0, 0, 0));
    const date: Date = this.calendarService.getDateByDayId(this.day.id);
    this.disabled = +date < +nowDay;
  }

  /** Getting the `grid-column-start` property depending on the day of the week */
  private getGridColumnStart(): WeekdayOrder | 7 {
    if (this.optionsService.getOptions().firstDayOfWeekIndex === 1) {
      // 0 is for Sunday
      return this.day.weekdayOrder === 0 ? 7 : this.day.weekdayOrder;
    }
    return this.day.weekdayOrder === 6 ? 0 : <WeekdayOrder | 7>(this.day.weekdayOrder + 1);
  }

  /** Setting the `grid-column-start` property depending on the day of the week */
  public setGridColumnStart(): void {
    const columnStart: number = this.getGridColumnStart();
    this.renderer.setStyle(this.elementRef.nativeElement, 'grid-column-start', columnStart);
  }

  /** Select a day */
  public select(): void {
    this.selected = !this.selected;
    this.calendarService.selectDate(this.day);
  }
}

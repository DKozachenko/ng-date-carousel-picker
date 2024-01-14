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
import { CalendarService } from '../../services';

/** Компонент дня календаря */
@Component({
  selector: 'dcp-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent implements OnInit {
  /** День */
  @Input({ required: true }) public day!: IDay;

  /** Недоступен ли день */
  @HostBinding('class.disabled') public disabled: boolean = false;

  /** Находится ли в начале недели */
  @HostBinding('class.in_week_start') public inWeekStart: boolean = false;

  /** Находится ли в конце недели */
  @HostBinding('class.in_week_end') public inWeekEnd: boolean = false;

  /** Выбран ли день */
  @HostBinding('class.selected') public selected: boolean = false;

  /** Находится ли в начале диапазона */
  @HostBinding('class.in_range_middle') public inRangeMiddle: boolean = false;

  /** Находится ли в середине диапазона */
  @HostBinding('class.in_range_start') public inRangeStart: boolean = false;

  /** Находится ли в конце диапазона */
  @HostBinding('class.in_range_end') public inRangeEnd: boolean = false;

  private readonly elementRef: ElementRef<Element> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly calendarService: CalendarService = inject(CalendarService);

  public ngOnInit(): void {
    // 1 - понедельник, 0 - воскреснье, особенности Date.getDay()
    this.inWeekStart = this.day.weekdayOrder === 1;
    this.inWeekEnd = this.day.weekdayOrder === 0;

    const nowDay: Date = new Date(new Date().setHours(0, 0, 0, 0));
    const date: Date = this.calendarService.getDateByDayId(this.day.id);
    this.disabled = +date < +nowDay;
  }

  /**
   * Получение свойства `grid-column-start` в зависимости от дня недели
   * @returns день недели
   */
  private getGridColumnStart(): WeekdayOrder | 7 {
    // 0 - воскреснье, особенности Date.getDay()
    return this.day.weekdayOrder === 0 ? 7 : this.day.weekdayOrder;
  }

  /** Установка свойства `grid-column-start` в зависимости от дня недели */
  public setGridColumnStart(): void {
    const columnStart: number = this.getGridColumnStart();
    this.renderer.setStyle(this.elementRef.nativeElement, 'grid-column-start', columnStart);
  }

  /** Выбор дня */
  public select(): void {
    this.selected = !this.selected;
    this.calendarService.selectDate(this.day);
  }
}
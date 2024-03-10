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
import { NgForOf } from '@angular/common';
import { IDay, IMonth, IRangeDayIds } from '../../models/interfaces';
import { CalendarDayComponent } from '../calendar-day/calendar-day.component';

@Component({
  selector: 'dcp-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
  imports: [NgForOf, CalendarDayComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthComponent implements AfterViewInit {
  @ViewChildren(CalendarDayComponent) private readonly dayComponents!: QueryList<CalendarDayComponent>;

  @Input({ required: true }) public month!: IMonth;

  /**
   * To update the states of days, it is the parent ChangeDetectorRef that is used
   * due to the specifics of HostBinding, described here https://github.com/angular/angular/issues/22560
   */
  @SkipSelf() private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngAfterViewInit(): void {
    this.setFirstDayGridColumnStart();
  }

  /** Setting the value of `grid-column-start` for the first day of the month */
  private setFirstDayGridColumnStart(): void {
    const firstMonthDay: CalendarDayComponent = <CalendarDayComponent>this.dayComponents.get(0);
    firstMonthDay.setGridColumnStart();
  }

  /** Updating states of being in a range of days */
  public updateDaysRangeState(rangeIds: IRangeDayIds): void {
    for (const calendarDay of this.dayComponents) {
      calendarDay.inRangeStart = calendarDay.day.id === rangeIds.startId;
      calendarDay.inRangeMiddle = rangeIds.inRangeIds.includes(calendarDay.day.id);
      calendarDay.inRangeEnd = calendarDay.day.id === rangeIds.endId;
      this.cdr.detectChanges();
    }
  }

  /** Update selection status for one day */
  public updateDaySelection(selectedDayId: string): void {
    for (const calendarDay of this.dayComponents) {
      calendarDay.selected = calendarDay.day.id === selectedDayId;
      calendarDay.inRangeStart = false;
      calendarDay.inRangeMiddle = false;
      calendarDay.inRangeEnd = false;
      this.cdr.detectChanges();
    }
  }

  public trackByDayId(index: number, day: IDay): string {
    return day.id;
  }
}

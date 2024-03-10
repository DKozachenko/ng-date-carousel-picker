import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { NgForOf } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IDateIndexes, IMonth, IRangeDayIds, IYear } from '../../models/interfaces';
import { MONTH_WIDTH } from '../../models/constants';
import { MonthOrder } from '../../models/types';
import { CalendarService } from '../../services';
import { CalendarMonthComponent } from '../calendar-month/calendar-month.component';

@UntilDestroy()
@Component({
  selector: 'dcp-calendar-months-track',
  templateUrl: './calendar-months-track.component.html',
  styleUrls: ['./calendar-months-track.component.scss'],
  imports: [NgForOf, CalendarMonthComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthsTrackComponent implements OnInit, AfterViewInit {
  @ViewChildren(CalendarMonthComponent) private readonly monthComponents!: QueryList<CalendarMonthComponent>;

  @ViewChild('scroller') private readonly scrollerRef!: ElementRef<HTMLDivElement>;

  private currentYearIndex: number = 0;
  private currentMonthIndex: MonthOrder = 0;

  @Input({ required: true }) public years: IYear[] = [];

  private readonly calendarService: CalendarService = inject(CalendarService);
  private readonly renderer: Renderer2 = inject(Renderer2);

  ngOnInit(): void {
    this.calendarService.dayIdsChangedObs$.pipe(untilDestroyed(this)).subscribe((data: IRangeDayIds | string) => {
      if (typeof data === 'string') {
        this.updateDaySelection(data);
      } else {
        this.updateDaysRangeState(data);
      }
    });
  }

  public ngAfterViewInit(): void {
    this.calendarService.dateIndexesObs$.pipe(untilDestroyed(this)).subscribe((indexes: IDateIndexes) => {
      this.currentMonthIndex = indexes.monthIndex;
      this.currentYearIndex = indexes.yearIndex;

      const scrolledMonthNumber: number = this.getScrolledMonthNumber();
      const newLeftValue: number = -(MONTH_WIDTH * scrolledMonthNumber);
      this.setScrollerLeft(newLeftValue);
    });
  }

  /** Getting the number of scrolled months */
  private getScrolledMonthNumber(): number {
    let result: number = 0;

    for (let i = 0; i < this.years.length; ++i) {
      if (i > this.currentYearIndex) {
        break;
      }

      for (let p = 0; p < this.years[i].months.length; ++p) {
        if (i === this.currentYearIndex && p >= this.currentMonthIndex) {
          break;
        }

        ++result;
      }
    }

    return result;
  }

  /** Updating the states of being in the range of days of months */
  private updateDaysRangeState(rangeIds: IRangeDayIds): void {
    for (const monthComponent of this.monthComponents) {
      monthComponent.updateDaysRangeState(rangeIds);
    }
  }

  /** Update selection status for one day */
  private updateDaySelection(selectedDayId: string): void {
    for (const monthComponent of this.monthComponents) {
      monthComponent.updateDaySelection(selectedDayId);
    }
  }

  /** Setting the `left` property for the scroller */
  public setScrollerLeft(value: number): void {
    this.renderer.setStyle(this.scrollerRef.nativeElement, 'left', `${value}px`);
  }

  public trackById(index: number, item: IYear | IMonth): string {
    return item.id;
  }
}

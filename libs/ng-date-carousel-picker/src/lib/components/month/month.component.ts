import {
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
import { DayComponent } from '../day/day.component';

@Component({
  selector: 'dcp-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  imports: [NgForOf, DayComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthComponent {
  @ViewChildren(DayComponent) public readonly dayComponents!: QueryList<DayComponent>;

  @Input({ required: true }) public month!: IMonth;

  /**
   * To update the states of days, it is the parent ChangeDetectorRef that is used
   * due to the specifics of HostBinding, described here https://github.com/angular/angular/issues/22560
   */
  @SkipSelf() private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  /** Update selection status for one day */
  updateDaySelection(selectedDayId: string): void {
    for (const dayComponent of this.dayComponents) {
      dayComponent.selected = dayComponent.day.id === selectedDayId;
      dayComponent.inRange = false;
      this.cdr.detectChanges();
    }
  }

  /** Update in range status for all days */
  updateDayRangeSelection(data: IRangeDayIds): void {
    for (const dayComponent of this.dayComponents) {
      dayComponent.inRange = data.inRangeIds.includes(dayComponent.day.id);
      this.cdr.detectChanges();
    }
  }

  public trackByDayId(index: number, day: IDay): string {
    return day.id;
  }
}

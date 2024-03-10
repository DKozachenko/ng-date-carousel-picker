import {
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
import { NgClass, NgForOf } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IMonth, IRangeDayIds } from '../../models/interfaces';
import { PickerService } from '../../services';
import { MonthComponent } from '../month/month.component';
import { DayComponent } from '../day/day.component';
import { SelectionComponent } from '../selection/selection.component';
import { DAY_WIDTH, DAYS_GAP, MONTHS_GAP } from '../../models/constants';

@UntilDestroy()
@Component({
  selector: 'dcp-days-track',
  templateUrl: './days-track.component.html',
  styleUrls: ['./days-track.component.scss'],
  imports: [NgClass, NgForOf, MonthComponent, SelectionComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysTrackComponent implements OnInit {
  @ViewChild('scroller') private readonly scrollerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('viewport') private readonly viewportRef!: ElementRef<HTMLDivElement>;

  @ViewChildren(MonthComponent) private readonly monthComponents!: QueryList<MonthComponent>;
  @ViewChild(SelectionComponent) private readonly selectionComponent!: SelectionComponent;

  @Input({ required: true }) public months: IMonth[] = [];

  /** Is the track at the very beginning */
  @Input({ required: true }) public inStart: boolean = true;

  /** Is the track at the very end */
  @Input({ required: true }) public inEnd: boolean = false;

  private readonly pickerService: PickerService = inject(PickerService);
  private readonly renderer: Renderer2 = inject(Renderer2);

  public ngOnInit(): void {
    this.pickerService.dayIdsChangedObs$.pipe(untilDestroyed(this)).subscribe((data: IRangeDayIds | string) => {
      if (typeof data === 'string') {
        this.monthComponents.forEach((item: MonthComponent) => item.updateDaySelection(data));
        this.selectionComponent.unselect();
      } else {
        this.monthComponents.forEach((item: MonthComponent) => item.updateDayRangeSelection(data));
        const selectionLeft: number = this.getSelectionLeft(data.startId);
        const selectionWidth: number = this.getSelectionWidth(data.startId, data.endId);
        this.selectionComponent.setSelectionLeft(selectionLeft);
        this.selectionComponent.select(selectionWidth);
      }
    });
  }

  /** Getting the left offset for a selection component */
  private getSelectionLeft(startDayId: string): number {
    let offset: number = 0;
    for (let i = 0; i < this.monthComponents.length; ++i) {
      const monthComponent: MonthComponent = <MonthComponent>this.monthComponents.get(i);

      for (let p = 0; p < monthComponent.dayComponents.length; ++p) {
        const dayComponent: DayComponent = <DayComponent>monthComponent.dayComponents.get(p);

        if (dayComponent.day.id === startDayId) {
          /**
           * It is necessary to add another "half" of the day so that the range is not with
           * from the very beginning of the first day, and from its middle
           */
          return offset + DAY_WIDTH / 2;
        }

        // For non-last days, add another distance between days
        offset += p === monthComponent.dayComponents.length - 1 ? DAY_WIDTH : DAY_WIDTH + DAYS_GAP;
      }

      // For non-last days, add the distance between months
      offset += i === this.monthComponents.length - 1 ? 0 : MONTHS_GAP;
    }

    /**
     * It's theoretically impossible to get to here, because it's in a loop
     * we will definitely find the starting day of the range
     */
    return offset;
  }

  /** Getting the width of a range selection component */
  private getSelectionWidth(startDayId: string, endDayId: string): number {
    let width: number = 0;
    let inRange: boolean = false;
    for (let i = 0; i < this.monthComponents.length; ++i) {
      const monthComponent: MonthComponent = <MonthComponent>this.monthComponents.get(i);

      for (let p = 0; p < monthComponent.dayComponents.length; ++p) {
        const dayComponent: DayComponent = <DayComponent>monthComponent.dayComponents.get(p);

        if (dayComponent.day.id === startDayId) {
          inRange = true;
        }

        if (dayComponent.day.id === endDayId) {
          width += DAY_WIDTH;
          inRange = false;
          continue;
        }

        if (inRange) {
          // For non-last days, add another distance between days
          width += p === monthComponent.dayComponents.length - 1 ? DAY_WIDTH : DAY_WIDTH + DAYS_GAP;
        }
      }

      if (inRange) {
        // For non-recent months, add the distance between months
        width += i === this.monthComponents.length - 1 ? 0 : MONTHS_GAP;
      }
    }

    /**
     * It is necessary to subtract another "half' of a day on each side,
     * so that the range at the beginning and end is from the middle of the day
     */
    return width - DAY_WIDTH;
  }

  /** Getting `scrollWidth` from the scroller */
  public getScrollerScrollWidth(): number {
    const scrollerElem: HTMLDivElement = this.scrollerRef.nativeElement;
    return scrollerElem.scrollWidth;
  }

  public getViewportWidth(): number {
    const viewportElem: HTMLDivElement = this.viewportRef.nativeElement;
    return viewportElem.clientWidth;
  }

  /** Getting the `left` property from the scroller */
  public getScrollerLeft(): number {
    return parseInt(getComputedStyle(this.scrollerRef.nativeElement).getPropertyValue('left'));
  }

  /** Setting the `left` property for the scroller */
  public setScrollerLeft(value: number): void {
    this.renderer.setStyle(this.scrollerRef.nativeElement, 'left', `${value}px`);
  }

  public trackByMonthId(index: number, month: IMonth): string {
    return month.id;
  }
}

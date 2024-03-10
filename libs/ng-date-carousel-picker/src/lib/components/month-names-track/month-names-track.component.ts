import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { IMonth } from '../../models/interfaces';
import { MonthNameComponent } from '../month-name/month-name.component';
import { NgFor, NgForOf } from '@angular/common';
import { DEFAULT_OPTIONS, DAY_WIDTH, DAYS_GAP, MONTHS_GAP } from '../../models/constants';
import { IntRange } from '../../models/types';
import { OptionsService } from '../../services';

@Component({
  selector: 'dcp-month-names-track',
  templateUrl: './month-names-track.component.html',
  styleUrls: ['./month-names-track.component.scss'],
  imports: [NgFor, NgForOf, MonthNameComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthNamesTrackComponent implements OnInit, AfterViewInit {
  private scrollShift: IntRange<42, 300> = DEFAULT_OPTIONS['scrollShift'];

  /** Distance between month names */
  private readonly distanceBeetweenNames: number = MONTHS_GAP;

  /**
   * The left indentation for month names is equal to the width of the control button (for this there is, for example,
   * sass variable `$control-button-width`) minus padding on one side
   * (which the `month-names-track` class has), i.e. = 62 -5
   */
  private readonly namesOffsetLeft: number = 57;

  @ViewChild('scroller') private readonly scrollerRef!: ElementRef<HTMLDivElement>;

  @ViewChildren(MonthNameComponent) private readonly namesComponents!: QueryList<MonthNameComponent>;

  /** Active month name index */
  public activeNameIndex: number = 0;

  @Input({ required: true }) public months: IMonth[] = [];

  private readonly optionsService: OptionsService = inject(OptionsService);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.scrollShift = this.optionsService.getOptions().scrollShift;
  }

  public ngAfterViewInit(): void {
    this.setNamesOffset();
  }

  private getMonthComponentWidth(dayNumber: number): number {
    return DAY_WIDTH * dayNumber + DAYS_GAP * (dayNumber - 1);
  }

  /** Setting the initial `left` property for month name components */
  private setNamesOffset(): void {
    // The first one is set to the initial value `namesOffsetLeft`
    let leftOffset: number = this.namesOffsetLeft;
    this.setNameComponentLeft(this.activeNameIndex, leftOffset);

    // For subsequent months, the width of all previous months is calculated and the distance between the names is added
    for (let i = 1; i < this.months.length; ++i) {
      const month: IMonth = this.months[i - 1];
      const monthWidth: number = this.getMonthComponentWidth(month.days.length);
      leftOffset += monthWidth + this.distanceBeetweenNames;
      this.setNameComponentLeft(i, leftOffset);
    }
  }

  /** Getting the distance between the current month name component and the previous one */
  private getDistanceBeetweenActiveAndPreviousName(): number {
    const activeMonthComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(this.activeNameIndex);

    const activeNameElem: HTMLParagraphElement = activeMonthComponent.nameRef.nativeElement;
    const prevNameElem: HTMLParagraphElement = this.getPreviousNameElement();

    const activeNameElemRect: DOMRect = activeNameElem.getBoundingClientRect();
    const prevNameElemRect: DOMRect = prevNameElem.getBoundingClientRect();

    return activeNameElemRect.left - (prevNameElemRect.left + prevNameElem.clientWidth);
  }

  /** Getting the distance between the current month name component and the next one */
  private getDistanceBeetweenActiveAndNextName(): number {
    const activeMonthComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(this.activeNameIndex);
    const nextMonthComponent: MonthNameComponent = <MonthNameComponent>(
      this.namesComponents.get(this.activeNameIndex + 1)
    );

    const activeNameElem: HTMLParagraphElement = activeMonthComponent.nameRef.nativeElement;
    const nextNameElem: HTMLParagraphElement = nextMonthComponent.nameRef.nativeElement;

    const activeNameElemRect: DOMRect = activeNameElem.getBoundingClientRect();
    const nextNameElemRect: DOMRect = nextNameElem.getBoundingClientRect();

    return nextNameElemRect.left - (activeNameElemRect.left + activeNameElem.clientWidth);
  }

  /** Getting the width of the active month name */
  private getActiveNameComponentWidth(): number {
    const activeMonthComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(this.activeNameIndex);
    return activeMonthComponent.nameRef.nativeElement.clientWidth;
  }

  /** Getting the previous (relatively active) month name element */
  private getPreviousNameElement(): HTMLParagraphElement {
    const prevMonthComponent: MonthNameComponent = <MonthNameComponent>(
      this.namesComponents.get(this.activeNameIndex - 1)
    );
    const prevNameElem: HTMLParagraphElement = prevMonthComponent.nameRef.nativeElement;
    return prevNameElem;
  }

  /** Getting the month component's indentation from the left edge of the first month */
  private getMonthComponentLeftOffset(index: number): number {
    let offset: number = 0;
    for (let i = 0; i <= index; ++i) {
      const month: IMonth = this.months[i];
      offset += this.getMonthComponentWidth(month.days.length);
      offset += this.distanceBeetweenNames;
    }
    return offset;
  }

  /** Setting the `left` property for the month name component */
  public setNameComponentLeft(index: number, value: number): void {
    const nameComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(index);
    this.renderer.setStyle(nameComponent.nameRef.nativeElement, 'left', `${value}px`);
  }

  /** Setting the initial `left` property for the active month name component */
  public setNameComponentStartLeft(): void {
    /**
     * When setting the active month name to an initial value, it may turn out that
     * the active element is now not the first (this happens when the first month has few days and the scroll exceeds
     * the entire width of the month), then you need to "fix" from the active month to the first (not inclusive) name
     * at first.
     * Theoretically, in this case `activeNameIndex` <= 1.
     * It might also be worth doing the same check when scrolling to the right, but taking into account the limitation on `scrollShift`
     * in the config, the option in which the scroll is larger than the width of the last month (which is filled completely) is almost
     * impossible
     */
    /* eslint-disable for-direction */
    for (let i = this.activeNameIndex; i > 0; --i) {
      this.attachActiveNameAtStart();
      --this.activeNameIndex;
      this.cdr.detectChanges();
    }
    this.setNameComponentLeft(this.activeNameIndex, this.namesOffsetLeft);
  }

  /** Setting the initial `left` property for the active month name component */
  public setNameComponentEndLeft(endShift: number): void {
    this.setNameComponentLeft(this.activeNameIndex, endShift + this.namesOffsetLeft);
  }

  /** Setting the `left` property for the active month name component */
  public setActiveNameComponentLeft(value: number): void {
    this.setNameComponentLeft(this.activeNameIndex, value);
  }

  /** Setting the `left` property for the scroller */
  public setScrollerLeft(value: number): void {
    this.renderer.setStyle(this.scrollerRef.nativeElement, 'left', `${value}px`);
  }

  private isFirstNameActive(): boolean {
    return this.activeNameIndex === 0;
  }

  private isLastNameActive(): boolean {
    return this.activeNameIndex === this.months.length - 1;
  }

  /** Is there enough space between month names for scrolling */
  private isDistanceBeetweenNamesEnough(distanceBetweenMonthNames: number): boolean {
    /** It is still necessary to subtract the distance between the names from the actual distance */
    return distanceBetweenMonthNames - this.distanceBeetweenNames > this.scrollShift;
  }

  /** "Pinning" the active name at the beginning of its month */
  private attachActiveNameAtStart(): void {
    /**
     * To "pin" an active name at the beginning of its month,
     * you need to get the indentation from the left edge of the previous month
     */
    const monthComponentOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex - 1);
    this.setActiveNameComponentLeft(this.namesOffsetLeft + monthComponentOffset);
  }

  /** "Pinning" the active name at the end of its month*/
  private attachActiveNameAtEnd(): void {
    /**
     * To "pin" an active name at the beginning of its month,
     * you need to get the indent from the left edge of the previous month, subtract
     * `distanceBeetweenNames` and subtract the width of the active month name
     */
    const monthOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex);
    const activeNameComponentWidth: number = this.getActiveNameComponentWidth();

    this.setActiveNameComponentLeft(
      this.namesOffsetLeft + monthOffset - this.distanceBeetweenNames - activeNameComponentWidth,
    );
  }

  /** Is there a transition to the previous month */
  private isGoingMovingToPreviousName(newLeftValue: number): boolean {
    const monthComponentOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex - 1);
    const prevNameElem: HTMLParagraphElement = this.getPreviousNameElement();

    /**
     * If the new scroll value (newLeftValue) is always negative, so in fact, how much
     * scrolled equal to `-newLeftValue`) less than the indent of the previous month from which
     * took away `distanceBeetweenNames` (this will be the actual distance from the month) and
     * the width of the previous month name, which means there has been a transition to the previous month
     */
    return -newLeftValue <= monthComponentOffset - this.distanceBeetweenNames - prevNameElem.clientWidth;
  }

  /** Is there a transition to the next month */
  private isGoingMovingToNextName(newLeftValue: number): boolean {
    const monthComponentOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex);

    /**
     * If the new scroll value (newLeftValue) is always negative, so in fact, how much
     * scrolled equal to `-newLeftValue`) greater than the previous month's indent
     * it means there has been a transition to the next month
     */
    return -newLeftValue >= monthComponentOffset;
  }

  public scrollLeft(newLeftValue: number): void {
    this.setScrollerLeft(newLeftValue);

    if (this.isFirstNameActive()) {
      /** The first element does not need to be checked in any way, as it has no other month names on the left */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    const distanceBetweenMonthNames: number = this.getDistanceBeetweenActiveAndPreviousName();

    if (this.isDistanceBeetweenNamesEnough(distanceBetweenMonthNames)) {
      /** If the distance between the month names is greater than what needs to be scrolled, then just scroll */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    /**
     * If the distance between the month names is less than what needs to be scrolled, then
     * it is necessary to "pin" the active name at the beginning of its month
     */
    this.attachActiveNameAtStart();

    if (this.isGoingMovingToPreviousName(newLeftValue)) {
      /** If there is a transition to the previous month, you need to change the index of the active title and scroll through it */
      --this.activeNameIndex;
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
    }

    this.cdr.detectChanges();
  }

  public scrollRight(newLeftValue: number): void {
    this.setScrollerLeft(newLeftValue);

    if (this.isLastNameActive()) {
      /** The first element does not need to be checked in any way, as it has no other month names on the right */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    const distanceBetweenMonthNames: number = this.getDistanceBeetweenActiveAndNextName();

    if (this.isDistanceBeetweenNamesEnough(distanceBetweenMonthNames)) {
      /** If the distance between the month names is greater than what needs to be scrolled, then just scroll */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    /**
     * If the distance between the month names is less than what needs to be scrolled, then
     * it is necessary to "pin" the active name at the end of its month
     */
    this.attachActiveNameAtEnd();

    if (this.isGoingMovingToNextName(newLeftValue)) {
      /** If there is a transition to the next month, you need to change the index of the active title and scroll through it */
      ++this.activeNameIndex;
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
    }

    this.cdr.detectChanges();
  }

  public trackByMonthId(index: number, month: IMonth): string {
    return month.id;
  }
}

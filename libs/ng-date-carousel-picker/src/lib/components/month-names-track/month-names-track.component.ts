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
import { DEFAULT_OPTIONS, DAY_WIDTH, DAYS_GAP, MONTHS_GAP } from '../../models/constants';
import { NgFor, NgForOf } from '@angular/common';
import { IntRange } from '../../models/types';
import { OptionsService } from '../../services';

/** Компонент трека с названиями месяцев */
@Component({
  selector: 'dcp-month-names-track',
  templateUrl: './month-names-track.component.html',
  styleUrls: ['./month-names-track.component.scss'],
  imports: [NgFor, NgForOf, MonthNameComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthNamesTrackComponent implements OnInit, AfterViewInit {
  /** Расстояние, которое скроллиться */
  private scrollShift: IntRange<42, 300> = DEFAULT_OPTIONS['scrollShift'];

  /** Расстояние между названиями месяцев */
  private readonly distanceBeetweenNames: number = MONTHS_GAP;

  /** Отступ слева у названий месяцев (=ширина кнопки - внутренний отступ с одной стороны = 62 - 5) */
  private readonly namesOffsetLeft: number = 57;

  /** Ссылка на элемент скроллера */
  @ViewChild('scroller') private readonly scroller!: ElementRef<HTMLDivElement>;

  /** Компоненты названий месяцев */
  @ViewChildren(MonthNameComponent) private readonly namesComponents!: QueryList<MonthNameComponent>;

  /** Индекс активного названия месяца */
  public activeNameIndex: number = 0;

  /** Месяцы */
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

  /** Установка начального свойства `left` для компонентов названий месяцев */
  private setNamesOffset(): void {
    // Для первого устанавливается изначальное значение `namesOffsetLeft`
    let leftOffset: number = this.namesOffsetLeft;
    this.setNameComponentLeft(this.activeNameIndex, leftOffset);

    // Для последующих высчитывается ширина всех предыдущих месяцев и добавляется расстояние между названиями
    for (let i = 1; i < this.months.length; ++i) {
      const month: IMonth = this.months[i - 1];
      const monthWidth: number = this.getMonthComponentWidth(month.days.length);
      leftOffset += monthWidth + this.distanceBeetweenNames;
      this.setNameComponentLeft(i, leftOffset);
    }
  }

  /**
   * Получение расстояния между текущим компонентом названия месяца и предыдущим
   * @returns расстояние
   */
  private getDistanceBeetweenActiveAndPreviousName(): number {
    const activeMonthComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(this.activeNameIndex);

    const activeNameElem: HTMLParagraphElement = activeMonthComponent.ref.nativeElement;
    const prevNameElem: HTMLParagraphElement = this.getPreviousNameElement();

    const activeNameElemRect: DOMRect = activeNameElem.getBoundingClientRect();
    const prevNameElemRect: DOMRect = prevNameElem.getBoundingClientRect();

    return activeNameElemRect.left - (prevNameElemRect.left + prevNameElem.clientWidth);
  }

  /**
   * Получение расстояния между текущим компонентом названия месяца и следующим
   * @returns расстояние
   */
  private getDistanceBeetweenActiveAndNextName(): number {
    const activeMonthComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(this.activeNameIndex);
    const nextMonthComponent: MonthNameComponent = <MonthNameComponent>(
      this.namesComponents.get(this.activeNameIndex + 1)
    );

    const activeNameElem: HTMLParagraphElement = activeMonthComponent.ref.nativeElement;
    const nextNameElem: HTMLParagraphElement = nextMonthComponent.ref.nativeElement;

    const activeNameElemRect: DOMRect = activeNameElem.getBoundingClientRect();
    const nextNameElemRect: DOMRect = nextNameElem.getBoundingClientRect();

    return nextNameElemRect.left - (activeNameElemRect.left + activeNameElem.clientWidth);
  }

  /**
   * Получение ширины активного названия месяца
   * @returns ширина
   */
  private getActiveNameComponentWidth(): number {
    const activeMonthComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(this.activeNameIndex);
    return activeMonthComponent.ref.nativeElement.clientWidth;
  }

  /**
   * Получение предыдущего (относительно активного) элемента названия месяца
   * @returns элемент
   */
  private getPreviousNameElement(): HTMLParagraphElement {
    const prevMonthComponent: MonthNameComponent = <MonthNameComponent>(
      this.namesComponents.get(this.activeNameIndex - 1)
    );
    const prevNameElem: HTMLParagraphElement = prevMonthComponent.ref.nativeElement;
    return prevNameElem;
  }

  /**
   * Получение отступа у компонента месяца от левого края первого месяца
   * @param index индекс компонента месяца
   * @returns отступ
   */
  private getMonthComponentLeftOffset(index: number): number {
    let offset: number = 0;
    for (let i = 0; i <= index; ++i) {
      const month: IMonth = this.months[i];
      offset += this.getMonthComponentWidth(month.days.length);
      offset += this.distanceBeetweenNames;
    }
    return offset;
  }

  /**
   * Установка свойства `left` для компонента названия месяца
   * @param index индекс компонента названия месяца
   * @param value значение
   */
  public setNameComponentLeft(index: number, value: number): void {
    const nameComponent: MonthNameComponent = <MonthNameComponent>this.namesComponents.get(index);
    this.renderer.setStyle(nameComponent.ref.nativeElement, 'left', `${value}px`);
  }

  /** Установка изначального свойства `left` для активного компонента названия месяца */
  public setNameComponentStartLeft(): void {
    /**
     * При установке у активного названия месяца начальное значение может оказаться, что
     * активный элемент сейчас не первый (такое бывает, когда у первого месяца мало дней и скролл превосходит
     * всю ширину месяца), тогда нужно от активного месяца до первого (не включительно) названия "закрепить"
     * в начале.
     * Теоретически в этом случае `activeNameIndex` <= 1.
     * Также, возможно, стоит делать такую же проверку при скролле вправо, но с учетом ограничения на `scrollShift`
     * в конфиге, вариант, в котором скролл больше ширины последнего месяца (который заполняется полностью), почти
     * невозможен
     */
    /* eslint-disable for-direction */
    for (let i = this.activeNameIndex; i > 0; --i) {
      this.attachActiveNameAtStart();
      --this.activeNameIndex;
      this.cdr.detectChanges();
    }
    this.setNameComponentLeft(this.activeNameIndex, this.namesOffsetLeft);
  }

  /**
   * Установка изначального свойства `left` для активного компонента названия месяца
   * @param endShift конечный сдвиг скроллера
   */
  public setNameComponentEndLeft(endShift: number): void {
    this.setNameComponentLeft(this.activeNameIndex, endShift + this.namesOffsetLeft);
  }

  /**
   * Установка свойства `left` для активного компонента названия месяца
   * @param value значение
   */
  public setActiveNameComponentLeft(value: number): void {
    this.setNameComponentLeft(this.activeNameIndex, value);
  }

  /**
   * Установка свойства `left` для скроллера
   * @param value значение
   */
  public setScrollerLeft(value: number): void {
    this.renderer.setStyle(this.scroller.nativeElement, 'left', `${value}px`);
  }

  /** Является ли первое название активным */
  private isFirstNameActive(): boolean {
    return this.activeNameIndex === 0;
  }

  /** Является ли последнее название активным */
  private isLastNameActive(): boolean {
    return this.activeNameIndex === this.months.length - 1;
  }

  /** Достаточно ли расстояния между названиями месяцев для скролла */
  private isDistanceBeetweenNamesEnough(distanceBetweenMonthNames: number): boolean {
    /** От фактического расстояния еще необходимо отнять расстояние между названиями */
    return distanceBetweenMonthNames - this.distanceBeetweenNames > this.scrollShift;
  }

  /** "Закрепление" активного названия в начале его месяца */
  private attachActiveNameAtStart(): void {
    /**
     * Чтобы "закрепить" активное название в начале его месяца,
     * необходимо получить отступ от левого края предыдущего месяца
     */
    const monthComponentOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex - 1);
    this.setActiveNameComponentLeft(this.namesOffsetLeft + monthComponentOffset);
  }

  /** "Закрепление" активного названия в конце его месяца */
  private attachActiveNameAtEnd(): void {
    /**
     * Чтобы "закрепить" активное название в начале его месяца,
     * необходимо получить отступ от левого края предыдущего месяца, отнять
     * `distanceBeetweenNames` и отнять ширину активного названия месяца
     */
    const monthOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex);
    const activeNameComponentWidth: number = this.getActiveNameComponentWidth();

    this.setActiveNameComponentLeft(
      this.namesOffsetLeft + monthOffset - this.distanceBeetweenNames - activeNameComponentWidth,
    );
  }

  /**
   * Происходит ли переход на предыдущий месяц
   * @param newLeftValue новое значение `left` у скроллера
   */
  private isGoingMovingToPreviousName(newLeftValue: number): boolean {
    const monthComponentOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex - 1);
    const prevNameElem: HTMLParagraphElement = this.getPreviousNameElement();

    /**
     * Если новое значение скролла (newLeftValue всегда отрицательно, поэтому по факту, то сколько
     * проскроллили равно `-newLeftValue`) меньше, чем отступ предыдущего месяца, от которого
     * отняли `distanceBeetweenNames` (это будет фактический отступ от месяца) и
     * ширину предыдущего названия месяца, значит произошел переход на предыдущий месяц
     */
    return -newLeftValue <= monthComponentOffset - this.distanceBeetweenNames - prevNameElem.clientWidth;
  }

  /**
   * Происходит ли переход на следующий месяц
   * @param newLeftValue новое значение `left` у скроллера
   */
  private isGoingMovingToNextName(newLeftValue: number): boolean {
    const monthComponentOffset: number = this.getMonthComponentLeftOffset(this.activeNameIndex);

    /**
     * Если новое значение скролла (newLeftValue всегда отрицательно, поэтому по факту, то сколько
     * проскроллили равно `-newLeftValue`) больше, чем отступ предыдущего месяца
     * значит произошел переход на следующий месяц
     */
    return -newLeftValue >= monthComponentOffset;
  }

  /**
   * Скролл влево
   * @param newLeftValue сдвиг / значение скролла
   */
  public scrollLeft(newLeftValue: number): void {
    this.setScrollerLeft(newLeftValue);

    if (this.isFirstNameActive()) {
      /** Первый элемент не нужно никак проверять, тк у него слева нет других названий месяцев */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    const distanceBetweenMonthNames: number = this.getDistanceBeetweenActiveAndPreviousName();

    if (this.isDistanceBeetweenNamesEnough(distanceBetweenMonthNames)) {
      /** Если расстояние между названиями месяцев больше, чем необходимо проскроллить, то просто скроллим */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    /**
     * Если расстояние между названиями месяцев меньше, чем необходимо проскроллить, то
     * необходимо "закрепить" активное название в начале его месяца
     */
    this.attachActiveNameAtStart();

    if (this.isGoingMovingToPreviousName(newLeftValue)) {
      /** Если произошел переход на предыдущий месяц, нужно изменить индекс активного названия и проскроллить его */
      --this.activeNameIndex;
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
    }

    this.cdr.detectChanges();
  }

  /**
   * Скролл вправо
   * @param newLeftValue сдвиг / значение скролла
   */
  public scrollRight(newLeftValue: number): void {
    this.setScrollerLeft(newLeftValue);

    if (this.isLastNameActive()) {
      /** Первый элемент не нужно никак проверять, тк у него справа нет других названий месяцев */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    const distanceBetweenMonthNames: number = this.getDistanceBeetweenActiveAndNextName();

    if (this.isDistanceBeetweenNamesEnough(distanceBetweenMonthNames)) {
      /** Если расстояние между названиями месяцев больше, чем необходимо проскроллить, то просто скроллим */
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
      this.cdr.detectChanges();
      return;
    }

    /**
     * Если расстояние между названиями месяцев меньше, чем необходимо проскроллить, то
     * необходимо "закрепить" активное название в конце его месяца
     */
    this.attachActiveNameAtEnd();

    if (this.isGoingMovingToNextName(newLeftValue)) {
      /** Если произошел переход на следующий месяц, нужно изменить индекс активного названия и проскроллить его */
      ++this.activeNameIndex;
      this.setActiveNameComponentLeft(-newLeftValue + this.namesOffsetLeft);
    }

    this.cdr.detectChanges();
  }

  /**
   * Функция trackBy для списка месяцев
   * @param index индекс
   * @param month месяц
   * @returns идентификатор месяца
   */
  public trackByMonthId(index: number, month: IMonth): string {
    return month.id;
  }
}

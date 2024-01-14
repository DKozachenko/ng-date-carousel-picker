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
import { IMonth, IRangeDayIds } from '../../models/interfaces';
import { MonthComponent } from '../month/month.component';
import { PickerService } from '../../services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DayComponent } from '../day/day.component';
import { SelectionComponent } from '../selection/selection.component';
import { dayWidth, daysGap, monthsGap } from '../../models/constants';

/** Компонент трека дней */
@UntilDestroy()
@Component({
  selector: 'dcp-days-track',
  templateUrl: './days-track.component.html',
  styleUrls: ['./days-track.component.scss'],
  imports: [MonthComponent, SelectionComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysTrackComponent implements OnInit {
  /** Ссылка на скроллер */
  @ViewChild('scroller') private readonly scroller!: ElementRef<HTMLDivElement>;

  /** Ссылка на вьюпорт */
  @ViewChild('viewport') private readonly viewport!: ElementRef<HTMLDivElement>;

  /** Компоненты месяцев */
  @ViewChildren(MonthComponent) private readonly monthComponents!: QueryList<MonthComponent>;

  /** Компонент выделения диапазаона */
  @ViewChild(SelectionComponent) private readonly selectionComponent!: SelectionComponent;

  /** Месяцы */
  @Input({ required: true }) public months: IMonth[] = [];

  /** Находится ли трек в самом начале */
  @Input({ required: true }) public inStart: boolean = true;

  /** Находится ли трек в самом конце */
  @Input({ required: true }) public inEnd: boolean = false;

  private readonly pickerService: PickerService = inject(PickerService);
  private readonly renderer: Renderer2 = inject(Renderer2);

  public ngOnInit(): void {
    this.pickerService.dayIdsChangedObs$.pipe(untilDestroyed(this)).subscribe((data: IRangeDayIds | string) => {
      if (typeof data === 'string') {
        this.monthComponents.forEach((item: MonthComponent) => item.updateDaySelection(data));
        this.selectionComponent.unselect();
      } else {
        const selectionLeft: number = this.getSelectionLeft(data.startId);
        const selectionWidth: number = this.getSelectionWidth(data.startId, data.endId);
        this.selectionComponent.setSelectionLeft(selectionLeft);
        this.selectionComponent.select(selectionWidth);
      }
    });
  }

  /**
   * Получение отступа слева для компонента выделеления
   * @param startDayId идентификатор для начала
   * @returns значение `left`
   */
  private getSelectionLeft(startDayId: string): number {
    let offset: number = 0;
    for (let i = 0; i < this.monthComponents.length; ++i) {
      const monthComponent: MonthComponent = <MonthComponent>this.monthComponents.get(i);

      for (let p = 0; p < monthComponent.dayComponents.length; ++p) {
        const dayComponent: DayComponent = <DayComponent>monthComponent.dayComponents.get(p);

        if (dayComponent.day.id === startDayId) {
          /**
           * Необходимо добавить еще "половинку" дня, чтобы диапазон был не с
           * самого начала первого дня, а с его середины
           */
          return offset + dayWidth / 2;
        }

        // Для непоследних дней добавляем еще расстояние между днями
        offset += p === monthComponent.dayComponents.length - 1 ? dayWidth : dayWidth + daysGap;
      }

      // Для непоследних дней добавляем расстояние между месяцами
      offset += i === this.monthComponents.length - 1 ? 0 : monthsGap;
    }

    /**
     * До сюда никогда теоретически нельзя дойти, потому что до этого в цикле
     * обязательно найдем начальный день диапазона
     */
    return offset;
  }

  /**
   * Получение ширины компонента выделения диапазаона
   * @param startDayId идентификатор для начала
   * @param endDayId идентификатор для конца
   * @returns ширина
   */
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
          width += dayWidth;
          inRange = false;
          continue;
        }

        if (inRange) {
          // Для непоследних дней добавляем еще расстояние между днями
          width += p === monthComponent.dayComponents.length - 1 ? dayWidth : dayWidth + daysGap;
        }
      }

      if (inRange) {
        // Для непоследних месяцев добавляем расстояние между месяцами
        width += i === this.monthComponents.length - 1 ? 0 : monthsGap;
      }
    }

    /**
     * Необходимо отнять еще по "половинке" дня с каждой стороны,
     * чтобы диапазон в начале и в конце был с середины дня
     */
    return width - dayWidth;
  }

  /**
   * Получение `scrollWidth` у скроллера
   * @returns `scrollWidth`
   */
  public getScrollerScrollWidth(): number {
    const scrollerElem: HTMLDivElement = this.scroller.nativeElement;
    return scrollerElem.scrollWidth;
  }

  /**
   * Получение ширины вьюпорта
   * @returns ширина
   */
  public getViewportWidth(): number {
    const viewportElem: HTMLDivElement = this.viewport.nativeElement;
    return viewportElem.clientWidth;
  }

  /**
   * Получение свойства `left` у скроллера
   * @returns значение `left`
   */
  public getScrollerLeft(): number {
    return parseInt(getComputedStyle(this.scroller.nativeElement).getPropertyValue('left'));
  }

  /**
   * Установка свойства `left` для скроллера
   * @param value значение
   */
  public setScrollerLeft(value: number): void {
    this.renderer.setStyle(this.scroller.nativeElement, 'left', `${value}px`);
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

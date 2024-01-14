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
import { IDateIndexes, IMonth, IRangeDayIds, IYear } from '../../models/interfaces';
import { MonthOrder } from '../../models/types';
import { CalendarService } from '../../services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CalendarMonthComponent } from '../calendar-month/calendar-month.component';

/** Компонент трека месяцев календаря */
@UntilDestroy()
@Component({
  selector: 'dcp-calendar-months-track',
  templateUrl: './calendar-months-track.component.html',
  styleUrls: ['./calendar-months-track.component.scss'],
  imports: [CalendarMonthComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthsTrackComponent implements OnInit, AfterViewInit {
  /** Компоненты месяцев */
  @ViewChildren(CalendarMonthComponent) private readonly monthComponents!: QueryList<CalendarMonthComponent>;

  /** Ссылка на скроллер */
  @ViewChild('scroller') private readonly scroller!: ElementRef<HTMLDivElement>;

  /** Текущий индекс года */
  private currentYearIndex: number = 0;

  /** Текущий индекс месяца */
  private currentMonthIndex: MonthOrder = 0;

  /** Ширина месяца */
  private readonly monthWidth: number = 272;

  /** Годы */
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
      const newLeftValue: number = -(this.monthWidth * scrolledMonthNumber);
      this.setScrollerLeft(newLeftValue);
    });
  }

  /**
   * Получение количества проскролленых месяцев
   * @returns количество проскроленных месяцев
   */
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

  /**
   * Обновление состояний нахождения в диапазоне у дней месяцов
   * @param rangeIds идентификаторы дней диапазона
   */
  private updateDaysRangeState(rangeIds: IRangeDayIds): void {
    for (const monthComponent of this.monthComponents) {
      monthComponent.updateDaysRangeState(rangeIds);
    }
  }

  /**
   * Обновление состояния выбора у одного дня
   * @param selectedDayId идентификатор выбранного дня
   */
  private updateDaySelection(selectedDayId: string): void {
    for (const monthComponent of this.monthComponents) {
      monthComponent.updateDaySelection(selectedDayId);
    }
  }

  /**
   * Установка свойства `left` для скроллера
   * @param value значение
   */
  public setScrollerLeft(value: number): void {
    this.renderer.setStyle(this.scroller.nativeElement, 'left', `${value}px`);
  }

  /**
   * Функция trackBy для отслеживания по идентификатору
   * @param index index
   * @param item месяц или год
   * @returns индекс
   */
  public trackById(index: number, item: IYear | IMonth): string {
    return item.id;
  }
}

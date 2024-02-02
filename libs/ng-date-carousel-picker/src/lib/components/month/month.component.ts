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
import { IDay, IMonth, IRangeDayIds } from '../../models/interfaces';
import { DayComponent } from '../day/day.component';
import { NgForOf } from '@angular/common';

/** Компонент месяца */
@Component({
  selector: 'dcp-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  imports: [NgForOf, DayComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthComponent {
  /** Компоненты дней */
  @ViewChildren(DayComponent) public readonly dayComponents!: QueryList<DayComponent>;

  /** Месяц */
  @Input({ required: true }) public month!: IMonth;

  // Для обновления состояний дней используется именно родительский ChangeDetectorRef
  // из-за специфики работы HostBinding, описанной тут https://github.com/angular/angular/issues/22560
  @SkipSelf() private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Обновление состояния выбора у одного дня
   * @param selectedDayId идентификатор выбранного дня
   */
  updateDaySelection(selectedDayId: string): void {
    for (const dayComponent of this.dayComponents) {
      dayComponent.selected = dayComponent.day.id === selectedDayId;
      dayComponent.inRange = false;
      this.cdr.detectChanges();
    }
  }

  updateDayRangeSelection(data: IRangeDayIds): void {
    for (const dayComponent of this.dayComponents) {
      dayComponent.inRange = data.inRangeIds.includes(dayComponent.day.id);
      this.cdr.detectChanges();
    }
  }

  /**
   * Функция trackBy для списка дней
   * @param index индекс
   * @param day день
   * @returns идентификатор дня
   */
  public trackByDayId(index: number, day: IDay): string {
    return day.id;
  }
}

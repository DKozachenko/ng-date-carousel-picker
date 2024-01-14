import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, inject } from '@angular/core';
import { IDay, ILocalization } from '../../models/interfaces';
import { WeekdayEng, WeekdayRu } from '../../models/types';
import { PickerService } from '../../services';
import { dayOrderWeekdayNames } from '../../models/constants';

/** Компонент дня */
@Component({
  selector: 'dcp-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayComponent implements OnInit {
  /** Сервис для дат */
  private readonly pickerService: PickerService = inject(PickerService);

  /** День */
  @Input({ required: true }) public day!: IDay;

  /** Английское название */
  public engName!: WeekdayEng;

  /** Русское название (сокращенное) */
  public ruName!: WeekdayRu;

  public ngOnInit(): void {
    const localization: ILocalization<WeekdayEng, WeekdayRu> = <ILocalization<WeekdayEng, WeekdayRu>>(
      dayOrderWeekdayNames.get(this.day.weekdayOrder)
    );
    this.engName = localization.eng;
    this.ruName = localization.ru;
  }

  /** Выбран ли день */
  @HostBinding('class.selected') public selected: boolean = false;

  /** Выбор дня */
  select(): void {
    this.selected = !this.selected;
    this.pickerService.selectDate(this.day);
  }
}

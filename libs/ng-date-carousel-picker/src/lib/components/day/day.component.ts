import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, inject } from '@angular/core';
import { IDay } from '../../models/interfaces';
import { InternalizationService, PickerService } from '../../services';

/** Компонент дня */
@Component({
  selector: 'dcp-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  standalone: true,
  providers: [InternalizationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayComponent implements OnInit {
  /** День */
  @Input({ required: true }) public readonly day!: IDay;

  public weekday: string = '';

  /** Сервис для дат */
  private readonly pickerService: PickerService = inject(PickerService);
  private readonly internalizationService: InternalizationService = inject(InternalizationService);

  public ngOnInit(): void {
    this.weekday = this.internalizationService.capitalizedWeekdays[this.day.weekdayOrder];
  }

  /** Выбран ли день */
  @HostBinding('class.selected') public selected: boolean = false;

  /** Выбор дня */
  select(): void {
    this.selected = !this.selected;
    this.pickerService.selectDate(this.day);
  }
}

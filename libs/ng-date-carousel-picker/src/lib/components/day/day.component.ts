import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, inject } from '@angular/core';
import { IDay } from '../../models/interfaces';
import { InternalizationService, OptionsService, PickerService } from '../../services';

@Component({
  selector: 'dcp-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  standalone: true,
  providers: [InternalizationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayComponent implements OnInit {
  @Input({ required: true }) public day!: IDay;

  public weekday: string = '';

  private readonly pickerService: PickerService = inject(PickerService);
  private readonly internalizationService: InternalizationService = inject(InternalizationService);
  private readonly optionsService: OptionsService = inject(OptionsService);

  public ngOnInit(): void {
    this.weekday = this.internalizationService.capitalizedWeekdays[this.day.weekdayOrder];
  }

  @HostBinding('class.selected') public selected: boolean = false;

  /** Is it in the range */
  @HostBinding('class.in_range') public inRange: boolean = false;

  /** Select a day */
  public select(): void {
    this.selected = !this.selected;
    this.pickerService.selectDate(this.day);
  }

  public isWeekend(): boolean {
    return this.optionsService.getOptions().weekendIndexes.includes(this.day.weekdayOrder);
  }
}

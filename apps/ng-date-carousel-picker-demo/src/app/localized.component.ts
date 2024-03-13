import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DCP_DATE_LOCALE,
  DEFAULT_OPTIONS,
  IPickerOptions,
  IRange,
  IRangeItem,
  NgDateCarouselPickerComponent,
} from 'ng-date-carousel-picker';

@Component({
  standalone: true,
  imports: [NgDateCarouselPickerComponent],
  providers: [{ provide: DCP_DATE_LOCALE, useValue: 'es-ES' }],
  selector: 'ng-date-carousel-picker-demo-localized',
  template: `
    <ng-date-carousel-picker
      [scrollShift]="primaryOptions.scrollShift"
      [startDate]="primaryOptions.startDate"
      [endDate]="primaryOptions.endDate"
      [showCalendar]="primaryOptions.showCalendar"
      [firstDayOfWeekIndex]="primaryOptions.firstDayOfWeekIndex"
      [weekendIndexes]="primaryOptions.weekendIndexes"
      (changed)="localizedChanged($event)"
    ></ng-date-carousel-picker>
  `,
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalizedComponent {
  public primaryOptions: IPickerOptions = DEFAULT_OPTIONS;

  public localizedChanged(data: IRange | IRangeItem | null) {
    console.log('Localized picker changed:', data);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NgDateCarouselPickerComponent,
  DEFAULT_OPTIONS,
  IPickerOptions,
  IRange,
  IRangeItem,
} from 'ng-date-carousel-picker';
import { LocalizedComponent } from './localized.component';
@Component({
  standalone: true,
  imports: [NgDateCarouselPickerComponent, LocalizedComponent],
  selector: 'ng-date-carousel-picker-demo-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public primaryOptions: IPickerOptions = DEFAULT_OPTIONS;

  public primaryChanged(data: IRange | IRangeItem | null) {
    console.log('Primary picker changed:', data);
  }

  public customizedChanged(data: IRange | IRangeItem | null) {
    console.log('Customized picker changed:', data);
  }
}

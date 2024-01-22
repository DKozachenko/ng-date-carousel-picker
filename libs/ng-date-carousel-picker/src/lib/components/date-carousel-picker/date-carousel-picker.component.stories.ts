import { type Meta, type StoryObj, applicationConfig } from '@storybook/angular';
import { DateCarouselPickerComponent } from './date-carousel-picker.component';
import { DCP_DATE_LOCALE } from '../../tokens';
import { provideAnimations } from '@angular/platform-browser/animations';

const meta: Meta<DateCarouselPickerComponent> = {
  component: DateCarouselPickerComponent,
  title: 'DateCarouselPickerComponent',
};
export default meta;
type Story = StoryObj<DateCarouselPickerComponent>;

export const Primary: Story = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), { provide: DCP_DATE_LOCALE, useValue: 'ru' }],
    }),
  ],
  args: {},
};

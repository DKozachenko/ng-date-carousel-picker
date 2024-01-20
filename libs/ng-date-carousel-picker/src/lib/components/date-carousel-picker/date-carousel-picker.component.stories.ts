import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { DateCarouselPickerComponent } from './date-carousel-picker.component';
import { DCP_DATE_LOCALE } from '../../tokens';

const meta: Meta<DateCarouselPickerComponent> = {
  component: DateCarouselPickerComponent,
  title: 'DateCarouselPickerComponent',
};
export default meta;
type Story = StoryObj<DateCarouselPickerComponent>;

export const Primary: Story = {
  decorators: [
    moduleMetadata({
      providers: [{ provide: DCP_DATE_LOCALE, useValue: 'en' }],
    }),
  ],
  args: {},
};

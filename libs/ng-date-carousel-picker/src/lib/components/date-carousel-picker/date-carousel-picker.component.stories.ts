import type { Meta, StoryObj } from '@storybook/angular';
import { DateCarouselPickerComponent } from './date-carousel-picker.component';

const meta: Meta<DateCarouselPickerComponent> = {
  component: DateCarouselPickerComponent,
  title: 'DateCarouselPickerComponent',
};
export default meta;
type Story = StoryObj<DateCarouselPickerComponent>;

export const Primary: Story = {
  args: {},
};

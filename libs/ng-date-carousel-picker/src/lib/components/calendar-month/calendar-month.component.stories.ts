import type { Meta, StoryObj } from '@storybook/angular';
import { CalendarMonthComponent } from './calendar-month.component';

const meta: Meta<CalendarMonthComponent> = {
  component: CalendarMonthComponent,
  title: 'CalendarMonthComponent',
};
export default meta;
type Story = StoryObj<CalendarMonthComponent>;

export const Primary: Story = {
  args: {},
};

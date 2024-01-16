import type { Meta, StoryObj } from '@storybook/angular';
import { CalendarDayComponent } from './calendar-day.component';

const meta: Meta<CalendarDayComponent> = {
  component: CalendarDayComponent,
  title: 'CalendarDayComponent',
};
export default meta;
type Story = StoryObj<CalendarDayComponent>;

export const Primary: Story = {
  args: {},
};

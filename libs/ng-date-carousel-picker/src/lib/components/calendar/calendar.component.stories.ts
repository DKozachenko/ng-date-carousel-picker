import type { Meta, StoryObj } from '@storybook/angular';
import { CalendarComponent } from './calendar.component';

const meta: Meta<CalendarComponent> = {
  component: CalendarComponent,
  title: 'CalendarComponent',
};
export default meta;
type Story = StoryObj<CalendarComponent>;

export const Primary: Story = {
  args: {},
};

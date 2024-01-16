import type { Meta, StoryObj } from '@storybook/angular';
import { CalendarMonthsTrackComponent } from './calendar-months-track.component';

const meta: Meta<CalendarMonthsTrackComponent> = {
  component: CalendarMonthsTrackComponent,
  title: 'CalendarMonthsTrackComponent',
};
export default meta;
type Story = StoryObj<CalendarMonthsTrackComponent>;

export const Primary: Story = {
  args: {
    years: [],
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { MonthNamesTrackComponent } from './month-names-track.component';

const meta: Meta<MonthNamesTrackComponent> = {
  component: MonthNamesTrackComponent,
  title: 'MonthNamesTrackComponent',
};
export default meta;
type Story = StoryObj<MonthNamesTrackComponent>;

export const Primary: Story = {
  args: {
    months: [],
  },
};

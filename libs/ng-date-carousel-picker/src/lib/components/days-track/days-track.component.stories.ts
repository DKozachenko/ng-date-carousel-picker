import type { Meta, StoryObj } from '@storybook/angular';
import { DaysTrackComponent } from './days-track.component';

const meta: Meta<DaysTrackComponent> = {
  component: DaysTrackComponent,
  title: 'DaysTrackComponent',
};
export default meta;
type Story = StoryObj<DaysTrackComponent>;

export const Primary: Story = {
  args: {
    months: [],
    inStart: true,
    inEnd: false,
  },
};

import type { Meta, StoryObj } from '@storybook/angular';
import { DayComponent } from './day.component';

const meta: Meta<DayComponent> = {
  component: DayComponent,
  title: 'DayComponent',
};
export default meta;
type Story = StoryObj<DayComponent>;

export const Primary: Story = {
  args: {},
};

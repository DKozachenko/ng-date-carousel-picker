import type { Meta, StoryObj } from '@storybook/angular';
import { MonthComponent } from './month.component';

const meta: Meta<MonthComponent> = {
  component: MonthComponent,
  title: 'MonthComponent',
};
export default meta;
type Story = StoryObj<MonthComponent>;

export const Primary: Story = {
  args: {},
};

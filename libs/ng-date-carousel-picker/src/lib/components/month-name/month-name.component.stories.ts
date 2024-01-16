import type { Meta, StoryObj } from '@storybook/angular';
import { MonthNameComponent } from './month-name.component';

const meta: Meta<MonthNameComponent> = {
  component: MonthNameComponent,
  title: 'MonthNameComponent',
};
export default meta;
type Story = StoryObj<MonthNameComponent>;

export const Primary: Story = {
  args: {
    isActive: false,
  },
};

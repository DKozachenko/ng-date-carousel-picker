import type { Meta, StoryObj } from '@storybook/angular';
import { SelectionComponent } from './selection.component';

const meta: Meta<SelectionComponent> = {
  component: SelectionComponent,
  title: 'SelectionComponent',
};
export default meta;
type Story = StoryObj<SelectionComponent>;

export const Primary: Story = {
  args: {},
};

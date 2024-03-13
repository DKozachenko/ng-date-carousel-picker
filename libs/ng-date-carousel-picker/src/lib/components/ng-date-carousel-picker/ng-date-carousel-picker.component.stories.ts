import { type Meta, type StoryObj } from '@storybook/angular';
import { NgDateCarouselPickerComponent } from './ng-date-carousel-picker.component';
import { DEFAULT_OPTIONS } from '../../models/constants';
import { CustomizationStory, LocalizationStory, PrimaryStory } from './stories';

const meta: Meta<NgDateCarouselPickerComponent> = {
  component: NgDateCarouselPickerComponent,
  title: 'NgDateCarouselPickerComponent',
  args: {
    scrollShift: DEFAULT_OPTIONS['scrollShift'],
    startDate: DEFAULT_OPTIONS['startDate'],
    endDate: DEFAULT_OPTIONS['endDate'],
    showCalendar: DEFAULT_OPTIONS['showCalendar'],
    firstDayOfWeekIndex: DEFAULT_OPTIONS['firstDayOfWeekIndex'],
    weekendIndexes: DEFAULT_OPTIONS['weekendIndexes'],
  },
  argTypes: {
    scrollShift: {
      name: 'scrollShift',
      defaultValue: DEFAULT_OPTIONS['scrollShift'],
      description: 'Distance (in px) which scrolls with button click. By default is `150`.',
      control: {
        type: 'number',
        min: 42,
        max: 300,
        step: 1,
      },
    },
    startDate: {
      name: 'startDate',
      defaultValue: DEFAULT_OPTIONS['startDate'],
      description: 'Date of period beginning. By default is current date.',
      control: {
        type: 'date',
      },
    },
    endDate: {
      name: 'endDate',
      defaultValue: DEFAULT_OPTIONS['endDate'],
      description: 'Date of period end. By default is exactly 3 months more than current date.',
      control: {
        type: 'date',
      },
    },
    showCalendar: {
      name: 'showCalendar',
      defaultValue: DEFAULT_OPTIONS['showCalendar'],
      description: 'Need to show calendar instead of scroll button in the end of period. By default is `true`.',
      control: {
        type: 'boolean',
      },
    },
    firstDayOfWeekIndex: {
      name: 'firstDayOfWeekIndex',
      defaultValue: DEFAULT_OPTIONS['firstDayOfWeekIndex'],
      description: 'Order (number) for first day of the week, `0` is for Sunday, `1` is for Monday. By default is `1`.',
      control: {
        type: 'radio',
      },
      options: [0, 1],
    },
    weekendIndexes: {
      name: 'weekendIndexes',
      defaultValue: DEFAULT_OPTIONS['weekendIndexes'],
      description: 'Numbers for weekend days. By default `[0, 6]`.',
      control: {
        type: 'array',
      },
    },
  },
};
export default meta;
type Story = StoryObj<NgDateCarouselPickerComponent>;

export const Primary: Story = PrimaryStory;
export const Customization: Story = CustomizationStory;
export const Localization: Story = LocalizationStory;

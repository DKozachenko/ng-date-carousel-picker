import { type Meta, type StoryObj } from '@storybook/angular';
import { NgDateCarouselPickerComponent } from './ng-date-carousel-picker.component';
import { DEFAULT_OPTIONS } from '../../models/constants';
import { CustomizationStory, LocalizationStory, PrimaryStory } from './stories';

//TODO: description
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
      description: '',
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
      description: '',
      control: {
        type: 'date',
      },
    },
    endDate: {
      name: 'endDate',
      defaultValue: DEFAULT_OPTIONS['endDate'],
      description: '',
      control: {
        type: 'date',
      },
    },
    showCalendar: {
      name: 'showCalendar',
      defaultValue: DEFAULT_OPTIONS['showCalendar'],
      description: '',
      control: {
        type: 'boolean',
      },
    },
    firstDayOfWeekIndex: {
      name: 'firstDayOfWeekIndex',
      defaultValue: DEFAULT_OPTIONS['firstDayOfWeekIndex'],
      description: '',
      control: {
        type: 'radio',
      },
      options: [0, 1],
    },
    weekendIndexes: {
      name: 'weekendIndexes',
      defaultValue: DEFAULT_OPTIONS['weekendIndexes'],
      description: '',
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

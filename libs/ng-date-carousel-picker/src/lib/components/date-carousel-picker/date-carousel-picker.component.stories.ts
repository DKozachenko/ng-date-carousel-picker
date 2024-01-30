import { type Meta, type StoryObj, applicationConfig } from '@storybook/angular';
import { HandlerFunction, action } from '@storybook/addon-actions';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgDateCarouselPickerComponent } from './date-carousel-picker.component';
import { DCP_DATE_LOCALE } from '../../tokens';
import { DEFAULT_OPTIONS } from '../../models/constants';
import { IRange, IRangeItem } from '../../models/interfaces';

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

export const Primary: Story = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), { provide: DCP_DATE_LOCALE, useValue: 'ru' }],
    }),
  ],
  render: (args) => ({
    styles: ['ng-date-carousel-picker { --test-var: purple; }'],
    props: {
      ...args,
      changeLog: (data: IRange | IRangeItem | null) => {
        const createAction: HandlerFunction = action('change');
        createAction(data);
      },
    },
    template: `
      <ng-date-carousel-picker 
        [scrollShift]="scrollShift"
        [startDate]="startDate"
        [endDate]="endDate"
        [showCalendar]="showCalendar"
        [firstDayOfWeekIndex]="firstDayOfWeekIndex"
        [weekendIndexes]="weekendIndexes"
        (changed)="changeLog($event)"
      ></ng-date-carousel-picker>
    `,
  }),
};

import { type StoryObj, applicationConfig } from '@storybook/angular';
import { HandlerFunction, action } from '@storybook/addon-actions';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgDateCarouselPickerComponent } from '../ng-date-carousel-picker.component';
import { IRange, IRangeItem } from '../../../models/interfaces';

type Story = StoryObj<NgDateCarouselPickerComponent>;

export const PrimaryStory: Story = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  render: (args) => ({
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

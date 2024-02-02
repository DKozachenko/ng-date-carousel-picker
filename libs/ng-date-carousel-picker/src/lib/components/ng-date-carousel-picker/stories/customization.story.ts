import { type StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgDateCarouselPickerComponent } from '../ng-date-carousel-picker.component';

type Story = StoryObj<NgDateCarouselPickerComponent>;

export const CustomizationStory: Story = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  render: (args) => ({
    styles: [
      `ng-date-carousel-picker { 
      --dcp-control-button-svg-color: purple;
      --dcp-weekday-color: blue;
      --dcp-month-name-border-color: orange;
      --dcp-month-name-active-background-color: orange;
     }`,
    ],
    props: args,
    template: `<ng-date-carousel-picker></ng-date-carousel-picker>`,
  }),
};

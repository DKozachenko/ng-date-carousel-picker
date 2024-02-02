import { type StoryObj, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgDateCarouselPickerComponent } from '../ng-date-carousel-picker.component';
import { DCP_DATE_LOCALE } from '../../../tokens';

type Story = StoryObj<NgDateCarouselPickerComponent>;

export const LocalizationStory: Story = {
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), { provide: DCP_DATE_LOCALE, useValue: 'es-ES' }],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `<ng-date-carousel-picker></ng-date-carousel-picker>`,
  }),
};

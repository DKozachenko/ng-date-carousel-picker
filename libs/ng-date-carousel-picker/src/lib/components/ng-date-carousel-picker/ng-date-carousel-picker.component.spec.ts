import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgDateCarouselPickerComponent } from './ng-date-carousel-picker.component';
import { DEFAULT_OPTIONS } from '../../models/constants';

describe('NgDateCarouselPickerComponent', () => {
  let component: NgDateCarouselPickerComponent;
  let fixture: ComponentFixture<NgDateCarouselPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgDateCarouselPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgDateCarouselPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correct default values', () => {
    expect(component.scrollShift).toBe(DEFAULT_OPTIONS.scrollShift);
    expect(component.startDate).toBe(DEFAULT_OPTIONS.startDate);
    expect(component.endDate).toBe(DEFAULT_OPTIONS.endDate);
    expect(component.showCalendar).toBe(DEFAULT_OPTIONS.showCalendar);
    expect(component.firstDayOfWeekIndex).toBe(DEFAULT_OPTIONS.firstDayOfWeekIndex);
    expect(component.weekendIndexes).toBe(DEFAULT_OPTIONS.weekendIndexes);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateCarouselPickerComponent } from './date-carousel-picker.component';

describe('RangeDatePickerComponent', () => {
  let component: DateCarouselPickerComponent;
  let fixture: ComponentFixture<DateCarouselPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateCarouselPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateCarouselPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgDateCarouselPickerComponent } from './ng-date-carousel-picker.component';

describe('RangeDatePickerComponent', () => {
  let component: NgDateCarouselPickerComponent;
  let fixture: ComponentFixture<NgDateCarouselPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgDateCarouselPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgDateCarouselPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

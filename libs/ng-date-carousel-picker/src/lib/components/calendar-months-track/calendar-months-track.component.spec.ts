import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarMonthTrackComponent } from './calendar-months-track.component';

describe('CalendarMonthTrackComponent', () => {
  let component: CalendarMonthTrackComponent;
  let fixture: ComponentFixture<CalendarMonthTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarMonthTrackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarMonthTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

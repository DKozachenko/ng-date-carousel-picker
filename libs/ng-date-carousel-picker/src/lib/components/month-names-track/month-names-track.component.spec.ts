import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthNamesTrackComponent } from './month-names-track.component';

describe('MonthNamesTrackComponent', () => {
  let component: MonthNamesTrackComponent;
  let fixture: ComponentFixture<MonthNamesTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthNamesTrackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthNamesTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

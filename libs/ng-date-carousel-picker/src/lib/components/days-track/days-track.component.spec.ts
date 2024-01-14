import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaysTrackComponent } from './days-track.component';

describe('DaysTrackComponent', () => {
  let component: DaysTrackComponent;
  let fixture: ComponentFixture<DaysTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DaysTrackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DaysTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthNameComponent } from './month-name.component';

describe('MonthNameComponent', () => {
  let component: MonthNameComponent;
  let fixture: ComponentFixture<MonthNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

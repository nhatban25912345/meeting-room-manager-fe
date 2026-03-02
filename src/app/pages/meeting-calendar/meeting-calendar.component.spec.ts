import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingCalendarComponent } from './meeting-calendar.component';

describe('MeetingCalendarComponent', () => {
  let component: MeetingCalendarComponent;
  let fixture: ComponentFixture<MeetingCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with February 2026', () => {
    expect(component.selectedDate.getMonth()).toBe(1); // February is month 1
    expect(component.selectedDate.getFullYear()).toBe(2026);
  });

  it('should get meetings for a specific date', () => {
    const testDate = new Date(2026, 1, 10); // February 10, 2026
    const meetings = component.getMeetingsForDate(testDate);
    expect(meetings.length).toBe(2);
    expect(meetings[0].title).toBe('Hội nghị CNTT toàn quốc');
  });

  it('should navigate to previous month', () => {
    const initialMonth = component.selectedDate.getMonth();
    component.previousMonth();
    expect(component.selectedDate.getMonth()).toBe(initialMonth - 1);
  });

  it('should navigate to next month', () => {
    const initialMonth = component.selectedDate.getMonth();
    component.nextMonth();
    expect(component.selectedDate.getMonth()).toBe(initialMonth + 1);
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('ready')).toBe('status-ready');
    expect(component.getStatusClass('preparing')).toBe('status-preparing');
    expect(component.getStatusClass('issue')).toBe('status-issue');
  });

  it('should format current month and year correctly', () => {
    const monthYear = component.getCurrentMonthYear();
    expect(monthYear).toContain('Tháng');
    expect(monthYear).toContain('2026');
  });
});

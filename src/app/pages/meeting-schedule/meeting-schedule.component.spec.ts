import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingScheduleComponent } from './meeting-schedule.component';

describe('MeetingScheduleComponent', () => {
  let component: MeetingScheduleComponent;
  let fixture: ComponentFixture<MeetingScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the search form', () => {
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.get('roomType')?.value).toBe('all');
  });

  it('should load meeting schedules', () => {
    component.loadMeetingSchedules();
    expect(component.loading).toBe(true);
    
    setTimeout(() => {
      expect(component.meetingGroups.length).toBeGreaterThan(0);
      expect(component.loading).toBe(false);
    }, 600);
  });

  it('should toggle group expansion', () => {
    const group = {
      date: '02/02/2026',
      dayOfWeek: 'Thứ hai',
      count: 9,
      expanded: false,
      meetings: []
    };

    component.toggleGroup(group);
    expect(group.expanded).toBe(true);

    component.toggleGroup(group);
    expect(group.expanded).toBe(false);
  });

  it('should get correct status color', () => {
    expect(component.getStatusColor('approved')).toBe('green');
    expect(component.getStatusColor('pending')).toBe('blue');
    expect(component.getStatusColor('rejected')).toBe('red');
    expect(component.getStatusColor('cancelled')).toBe('default');
  });

  it('should reset form', () => {
    component.searchForm.patchValue({
      meetingOwner: 'Test Owner',
      participants: 'Test Participant'
    });

    component.reset();

    expect(component.searchForm.get('meetingOwner')?.value).toBe(null);
    expect(component.searchForm.get('participants')?.value).toBe(null);
    expect(component.searchForm.get('roomType')?.value).toBe('all');
  });
});

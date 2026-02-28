import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeetingFilterComponent } from './meeting-filter/meeting-filter.component';
import { MeetingTableComponent, MeetingSchedule, MeetingGroup } from './meeting-table/meeting-table.component';
import { RoomService } from '../../services/room.service';
import { MeetingService, MeetingSearchRequest } from '../../services/meeting.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-meeting-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MeetingFilterComponent,
    MeetingTableComponent
  ],
  templateUrl: './meeting-schedule.component.html',
  styleUrl: './meeting-schedule.component.scss'
})
export class MeetingScheduleComponent implements OnInit {
  searchForm!: FormGroup;
  meetingGroups: MeetingGroup[] = [];
  loading = false;
  totalMeetings = 0;
  showFilterPanel = false;
  roomCodeOptions: Array<{ value: string; label: string }> = [];

  statusOptions = [
    { label: 'Tạo mới', value: 'CREATED', color: 'default' },
    { label: 'Chờ duyệt', value: 'PENDING_APPROVAL', color: 'blue' },
    { label: 'Đã duyệt', value: 'APPROVED', color: 'green' },
    { label: 'Từ chối', value: 'REJECTED', color: 'red' },
    { label: 'Hủy', value: 'CANCELED', color: 'gray' }
  ];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private meetingService: MeetingService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAvailableRooms();
    this.loadMeetingSchedules();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      roomCode: [null],
      organizer: [''],
      meetingOwner: [''],
      timeFrom: [null],
      timeTo: [null],
      createdFrom: [null],
      createdTo: [null],
      scheduleType: [''],
      usageStatus: [''],
      searchMember: [''],
      searchType: [''],
      status: [null],
      meetingType: [null]
    });
  }

  loadAvailableRooms(): void {
    this.roomService.getAvailableRooms().subscribe({
      next: (response) => {
        if (response.status.statusCode === 'SUCCESS' && response.data) {
          this.roomCodeOptions = response.data.map(room => ({
            value: room.roomCode,
            label: `${room.roomCode} - ${room.roomName} - ${room.location}`
          }));
        }
      },
      error: (error) => {
        console.error('Error loading available rooms:', error);
        this.message.error('Không thể tải danh sách phòng họp');
      }
    });
  }

  loadMeetingSchedules(): void {
    this.loading = true;
    
    const formValue = this.searchForm.value;
    
    // Build search request
    const request: MeetingSearchRequest = {
      roomCode: formValue.roomCode || undefined,
      organizer: formValue.organizer || undefined,
      meetingDateFrom: formValue.timeFrom ? this.formatDateToString(formValue.timeFrom) : undefined,
      meetingDateTo: formValue.timeTo ? this.formatDateToString(formValue.timeTo) : undefined,
      createdAtFrom: formValue.createdFrom ? this.formatDateToString(formValue.createdFrom) : undefined,
      createdAtTo: formValue.createdTo ? this.formatDateToString(formValue.createdTo) : undefined,
      status: formValue.status || undefined,
      scheduleType: formValue.scheduleType || undefined,
      page: 0,
      size: 100, // Load more items to group properly
      sort: 'meetingDate,desc'
    };

    this.meetingService.searchMeetingsGrouped(request).subscribe({
      next: (response) => {
        // Map API data to UI model
        this.meetingGroups = response.groups.map(group => ({
          date: group.meetingDate,
          dayOfWeek: group.dayOfWeek,
          count: group.count,
          expanded: false,
          meetings: group.meetings.map(meeting => ({
            id: meeting.id.toString(),
            time: `${this.formatTime(meeting.startTime)} - ${this.formatTime(meeting.endTime)}`,
            location: meeting.roomCode, // Using roomCode as location for now
            status: meeting.status,
            title: meeting.subject,
            organizer: meeting.participantUserIds && meeting.participantUserIds.length > 0 
              ? meeting.participantUserIds[0].fullName 
              : meeting.createdBy,
            organizingUnit: meeting.organizerUnit,
            dressCode: meeting.dressCode,
            notes: meeting.note || ''
          }))
        }));
        
        // Expand first group by default
        if (this.meetingGroups.length > 0) {
          this.meetingGroups[0].expanded = true;
        }
        
        this.totalMeetings = response.totalMeetings;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading meeting schedules:', error);
        this.message.error('Không thể tải danh sách lịch họp');
        this.meetingGroups = [];
        this.totalMeetings = 0;
        this.loading = false;
      }
    });
  }

  /**
   * Format Date object to YYYY-MM-DD string
   */
  private formatDateToString(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format time from HH:mm:ss to HH:mm
   */
  private formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // Extract HH:mm from HH:mm:ss
  }

  search(): void {
    console.log('Search form:', this.searchForm.value);
    this.loadMeetingSchedules();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  resetFilter(): void {
    this.searchForm.reset({
      roomCode: null,
      organizer: '',
      meetingOwner: '',
      timeFrom: null,
      timeTo: null,
      createdFrom: null,
      createdTo: null,
      scheduleType: '',
      usageStatus: '',
      searchMember: '',
      searchType: '',
      status: null,
      meetingType: null
    });
    this.loadMeetingSchedules();
  }

  exportData(): void {
    console.log('Exporting data');
    // Implement export functionality
  }

  toggleGroup(group: MeetingGroup): void {
    group.expanded = !group.expanded;
    
    // Load meetings for this group if not loaded
    if (group.expanded && group.meetings.length === 0) {
      // Load meetings from API
      console.log('Loading meetings for', group.date);
    }
  }

  viewDetails(meeting: MeetingSchedule): void {
    console.log('View meeting details:', meeting);
    // Navigate to meeting details or open modal
  }

  editMeeting(meeting: MeetingSchedule): void {
    console.log('Edit meeting:', meeting);
    // Navigate to edit page or open modal
  }

  deleteMeeting(meeting: MeetingSchedule): void {
    console.log('Delete meeting:', meeting);
    // Show confirmation and delete
  }
}

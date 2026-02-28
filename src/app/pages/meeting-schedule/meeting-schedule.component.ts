import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeetingFilterComponent } from './meeting-filter/meeting-filter.component';
import { MeetingTableComponent, MeetingSchedule, MeetingGroup } from './meeting-table/meeting-table.component';

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

  statusOptions = [
    { label: 'Chờ duyệt', value: 'pending', color: 'blue' },
    { label: 'Đã duyệt', value: 'approved', color: 'green' },
    { label: 'Từ chối', value: 'rejected', color: 'red' },
    { label: 'Hủy', value: 'cancelled', color: 'default' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMeetingSchedules();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      roomType: ['all'],
      meetingOwner: [''],
      participants: [''],
      participatingUnit: [''],
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

  loadMeetingSchedules(): void {
    this.loading = true;
    
    // Sample data - replace with actual API call
    setTimeout(() => {
      this.meetingGroups = [
        {
          date: '02/02/2026',
          dayOfWeek: 'Thứ hai',
          count: 9,
          expanded: true,
          meetings: [
            {
              id: '1',
              time: '08:00-08:30',
              location: 'F101_Nexus_Tầng 2_36A DVH',
              status: 'approved',
              title: 'Daily dự án UBCK',
              organizer: 'Nguyễn Bá Ngọc',
              preparation: '- Nguyễn Minh Đức, Dương Ngọc Linh, Đặng Văn Hùng, Thái...',
              participants: '- Hoàng Mạnh Linh, Vũ Ngọc Tiến, Trần Thanh Hòa, Nguyễn...',
              internalParticipants: '- Hoàng Mạnh Linh, Lê Văn Chính',
              responseStatus: 'Thường phúc',
              notes: 'Phòng họp có tivi',
              meetingMinutes: ''
            },
            {
              id: '2',
              time: '09:00-11:00',
              location: 'Phòng họp 44.06 - T44 Keangnam',
              status: 'approved',
              title: 'Brainstorming cải thiến chất lượng nền tảng vay',
              organizer: 'Nguyễn Anh Chiến',
              preparation: '- Hoàng Mạnh Linh, Vũ Ngọc Tiến, Trần Thanh Hòa, Nguyễn...',
              participants: '- Hoàng Mạnh Linh, Lê Văn Chính',
              internalParticipants: '- Hoàng Mạnh Linh, Lê Văn Chính',
              responseStatus: 'Thường phúc',
              notes: '',
              meetingMinutes: ''
            },
            {
              id: '3',
              time: '10:00-12:00',
              location: 'PH Stevejobs - Tầng 44 Keangnam',
              status: 'approved',
              title: '[KTDL] Retro and Planning',
              organizer: 'Bùi Thị Ngọc Anh',
              preparation: '- Hoàng Đức Hiệp, Đỗ Thùy Hằng, Đỗ Thùy Trang, Thái Thi...',
              participants: '- Đỗ Thùy Hằng',
              internalParticipants: '- Đỗ Thùy Hằng',
              responseStatus: 'Thường phúc',
              notes: 'Cần phòng họp kín',
              meetingMinutes: ''
            }
          ]
        },
        {
          date: '03/02/2026',
          dayOfWeek: 'Thứ ba',
          count: 4,
          expanded: false,
          meetings: []
        },
        {
          date: '04/02/2026',
          dayOfWeek: 'Thứ tư',
          count: 6,
          expanded: false,
          meetings: []
        }
      ];
      
      this.totalMeetings = this.meetingGroups.reduce((sum, group) => sum + group.count, 0);
      this.loading = false;
    }, 500);
  }

  search(): void {
    console.log('Search form:', this.searchForm.value);
    this.loadMeetingSchedules();
  }

  reset(): void {
    this.searchForm.reset({
      roomType: 'all'
    });
    this.loadMeetingSchedules();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  resetFilter(): void {
    this.searchForm.reset({
      roomType: 'all',
      meetingOwner: '',
      participants: '',
      participatingUnit: '',
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeetingFilterComponent } from './meeting-filter/meeting-filter.component';
import { MeetingTableComponent, MeetingSchedule, MeetingGroup } from './meeting-table/meeting-table.component';
import { RoomService } from '../../services/room.service';
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
              time: '08:00 - 08:30',
              location: 'F101_Nexus_Tầng 2_36A DVH',
              status: 'approved',
              title: 'Daily dự án UBCK',
              organizer: 'Nguyễn Bá Ngọc',
              organizingUnit: 'Vụ Kế hoạch',
              dressCode: 'Thường phục',
              notes: 'Phòng họp có tivi'
            },
            {
              id: '2',
              time: '09:00 - 11:00',
              location: 'Phòng họp 44.06 - T44 Keangnam',
              status: 'approved',
              title: 'Brainstorming cải thiến chất lượng nền tảng vay',
              organizer: 'Nguyễn Anh Chiến',
              organizingUnit: 'Văn phòng Bộ',
              dressCode: 'Công sở',
              notes: ''
            },
            {
              id: '3',
              time: '10:00 - 12:00',
              location: 'PH Stevejobs - Tầng 44 Keangnam',
              status: 'approved',
              title: '[KTDL] Retro and Planning',
              organizer: 'Bùi Thị Ngọc Anh',
              organizingUnit: 'Vụ Tài chính',
              dressCode: 'Thường phục',
              notes: 'Cần phòng họp kín'
            },
            {
              id: '4',
              time: '13:00 - 14:30',
              location: 'F101_Nexus_Tầng 2_36A DVH',
              status: 'pending',
              title: 'Họp giao ban tuần',
              organizer: 'Trần Văn Nam',
              organizingUnit: 'Vụ Tổ chức',
              dressCode: 'Trang trọng',
              notes: 'Cần chuẩn bị máy chiếu'
            },
            {
              id: '5',
              time: '14:00 - 16:00',
              location: 'Phòng họp 44.06 - T44 Keangnam',
              status: 'rejected',
              title: 'Thảo luận kế hoạch Q2',
              organizer: 'Lê Thị Mai',
              organizingUnit: 'Văn phòng Bộ',
              dressCode: 'Công sở',
              notes: 'Trùng lịch họp khác'
            },
            {
              id: '6',
              time: '15:00 - 17:00',
              location: 'PH Stevejobs - Tầng 44 Keangnam',
              status: 'pending',
              title: 'Review dự án tháng 2',
              organizer: 'Phạm Văn Hùng',
              organizingUnit: 'Vụ Kế hoạch',
              dressCode: 'Thường phục',
              notes: ''
            }
          ]
        },
        {
          date: '03/02/2026',
          dayOfWeek: 'Thứ ba',
          count: 4,
          expanded: false,
          meetings: [
            {
              id: '7',
              time: '08:30 - 10:00',
              location: 'F101_Nexus_Tầng 2_36A DVH',
              status: 'approved',
              title: 'Họp ban lãnh đạo',
              organizer: 'Hoàng Văn Tuấn',
              organizingUnit: 'Văn phòng Bộ',
              dressCode: 'Trang trọng',
              notes: 'Họp quan trọng'
            },
            {
              id: '8',
              time: '14:00 - 15:30',
              location: 'Phòng họp 44.06 - T44 Keangnam',
              status: 'approved',
              title: 'Training nhân sự mới',
              organizer: 'Đỗ Thị Lan',
              organizingUnit: 'Vụ Tổ chức',
              dressCode: 'Thường phục',
              notes: ''
            }
          ]
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { MeetingService, MeetingData } from '../../services/meeting.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface MeetingPlan {
  id: string;
  meetingDate: string;
  time: string;
  location: string;
  title: string;
  organizer: string;
  organizingUnit: string;
  status: string;
  statusColor: string;
  dressCode: string;
  notes: string;
}

@Component({
  selector: 'app-plan-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTableModule,
    NzIconModule,
    NzTabsModule,
    NzSelectModule,
    NzTagModule,
    NzCardModule,
    NzDropDownModule,
    NzBadgeModule,
    NzSpaceModule,
    NzToolTipModule,
    NzMessageModule
  ],
  templateUrl: './plan-management.component.html',
  styleUrl: './plan-management.component.scss'
})
export class PlanManagementComponent implements OnInit {
  searchForm!: FormGroup;
  loading = false;
  selectedTab = 0;
  searchText = '';
  
  // Tab counts
  tabCounts = {
    approved: 0,
    pending: 0,
    rejected: 0,
    deleted: 0,
    newPlans: 0
  };

  filteredPlans: MeetingPlan[] = [];
  
  // Mapping tab index to status
  private tabStatusMap: { [key: number]: string } = {
    0: 'APPROVED',
    1: 'PENDING',
    2: 'REJECTED',
    3: 'DELETED',
    4: 'CREATED'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private meetingService: MeetingService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMeetings();
    this.loadTabCounts();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.loading = true;
    const status = this.tabStatusMap[this.selectedTab];
    
    this.meetingService.listMeetings({
      page: 0,
      size: 100,
      sort: 'createdAt,desc',
      status: status
    }).subscribe({
      next: (response: any) => {
        if (response.status.statusCode === 'SUCCESS' && response.data) {
          this.filteredPlans = this.mapMeetingsToPlans(response.data.content);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading meetings:', error);
        this.message.error('Không thể tải danh sách cuộc họp');
        this.loading = false;
      }
    });
  }

  loadTabCounts(): void {
    // Load counts for each tab
    Object.keys(this.tabStatusMap).forEach((tabIndex: any) => {
      const status = this.tabStatusMap[tabIndex];
      this.meetingService.listMeetings({
        page: 0,
        size: 1,
        sort: 'createdAt,desc',
        status: status
      }).subscribe({
        next: (response: any) => {
          if (response.status.statusCode === 'SUCCESS' && response.data) {
            const count = response.data.totalElements;
            switch (parseInt(tabIndex)) {
              case 0: this.tabCounts.approved = count; break;
              case 1: this.tabCounts.pending = count; break;
              case 2: this.tabCounts.rejected = count; break;
              case 3: this.tabCounts.deleted = count; break;
              case 4: this.tabCounts.newPlans = count; break;
            }
          }
        },
        error: (error: any) => {
          console.error('Error loading tab counts:', error);
        }
      });
    });
  }

  mapMeetingsToPlans(meetings: MeetingData[]): MeetingPlan[] {
    return meetings.map(meeting => ({
      id: meeting.id.toString(),
      meetingDate: this.formatDate(meeting.meetingDate),
      time: `${meeting.startTime.substring(0, 5)} - ${meeting.endTime.substring(0, 5)}`,
      location: meeting.roomCode,
      title: meeting.subject,
      organizer: meeting.createdBy,
      organizingUnit: meeting.organizerUnit,
      status: meeting.status,
      statusColor: this.getStatusColor(meeting.status),
      dressCode: meeting.dressCode,
      notes: meeting.note || ''
    }));
  }

  formatDate(dateStr: string): string {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  search(): void {
    const searchValue = this.searchText?.toLowerCase() || '';
    if (searchValue) {
      this.loadMeetings();
    } else {
      this.loadMeetings();
    }
  }

  createNewPlan(): void {
    // Navigate to create new plan page
    this.router.navigate(['/home/bookings-new']);
  }

  viewPlan(plan: MeetingPlan): void {
    console.log('View plan:', plan);
  }

  editPlan(plan: MeetingPlan): void {
    console.log('Edit plan:', plan);
  }

  deletePlan(plan: MeetingPlan): void {
    console.log('Delete plan:', plan);
  }

  applyFilters(): void {
    // Apply additional filters
    this.search();
  }

  getStatusColor(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CREATED': 'default',
      'PENDING_APPROVAL': 'cyan',
      'APPROVED': 'green',
      'REJECTED': 'red',
      'CANCELED': 'gray'
    };
    return statusMap[status] || 'default';
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CREATED': 'Tạo mới',
      'PENDING_APPROVAL': 'Chờ duyệt',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối',
      'CANCELED': 'Hủy'
    };
    return statusMap[status] || status;
  }
}

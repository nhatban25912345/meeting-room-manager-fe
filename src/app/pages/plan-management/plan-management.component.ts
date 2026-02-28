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
    NzToolTipModule
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
    approved: 2,
    pending: 2,
    rejected: 1,
    deleted: 1,
    newPlans: 1
  };

  // Meeting plans data
  meetingPlans: MeetingPlan[] = [
    {
      id: '1',
      meetingDate: '15/02/2026',
      time: '08:00 - 11:30',
      location: 'P001',
      title: 'Hội nghị giao ban tháng 2/2026',
      organizer: 'Nguyễn Văn A',
      organizingUnit: 'Văn phòng Bộ',
      status: 'APPROVED',
      statusColor: 'green',
      dressCode: 'Vest',
      notes: 'Toàn bộ cán bộ quản lý tham dự'
    },
    {
      id: '2',
      meetingDate: '18/02/2026',
      time: '14:00 - 16:00',
      location: 'P002',
      title: 'Họp triển khai kế hoạch Q1/2026',
      organizer: 'Trần Thị B',
      organizingUnit: 'Vụ Kế hoạch',
      status: 'APPROVED',
      statusColor: 'green',
      dressCode: 'Công sở',
      notes: 'Chuẩn bị tài liệu báo cáo'
    }
  ];

  newMeetingPlans: MeetingPlan[] = [
    {
      id: '3',
      meetingDate: '01/03/2026',
      time: '08:30 - 12:00',
      location: 'P001',
      title: 'Hội nghị sơ kết 6 tháng đầu năm',
      organizer: 'Nguyễn Văn A',
      organizingUnit: 'Văn phòng Bộ',
      status: 'CREATED',
      statusColor: 'default',
      dressCode: 'Vest',
      notes: ''
    }
  ];

  filteredPlans: MeetingPlan[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.updateFilteredPlans();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.updateFilteredPlans();
  }

  updateFilteredPlans(): void {
    switch (this.selectedTab) {
      case 0: // Đã phê duyệt
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'APPROVED');
        break;
      case 1: // Chờ phê duyệt
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'PENDING_APPROVAL');
        break;
      case 2: // Từ chối
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'REJECTED');
        break;
      case 3: // Đã xóa
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'CANCELED');
        break;
      case 4: // Tạo mới
        this.filteredPlans = this.newMeetingPlans;
        break;
      default:
        this.filteredPlans = this.meetingPlans;
    }
  }

  search(): void {
    const searchValue = this.searchForm.get('search')?.value?.toLowerCase() || '';
    if (searchValue) {
      this.filteredPlans = this.filteredPlans.filter(plan =>
        plan.title.toLowerCase().includes(searchValue) ||
        plan.organizer.toLowerCase().includes(searchValue) ||
        plan.organizingUnit.toLowerCase().includes(searchValue)
      );
    } else {
      this.updateFilteredPlans();
    }
  }

  clearSearch(): void {
    this.searchForm.patchValue({ search: '' });
    this.updateFilteredPlans();
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

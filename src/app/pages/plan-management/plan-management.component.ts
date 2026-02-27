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

interface MeetingPlan {
  id: string;
  title: string;
  level: string;
  type: string;
  hostOrganization: string;
  host: string;
  date: string;
  time: string;
  status: string;
  statusColor: string;
  duration: string;
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
    NzSpaceModule
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
      title: 'Hội nghị giao ban tháng 2/2026',
      level: 'Cấp Bộ',
      type: 'Trực tuyến',
      hostOrganization: 'Văn phòng Bộ',
      host: 'Nguyễn Văn A',
      date: '2026-02-15',
      time: '08:00 - 11:30',
      duration: '12 Giờ 5 phút và gia',
      status: 'Đã duyệt',
      statusColor: 'green'
    },
    {
      id: '2',
      title: 'Họp triển khai kế hoạch Q1/2026',
      level: 'Cấp Vụ',
      type: 'Trực tiếp',
      hostOrganization: 'Vụ Kế hoạch',
      host: 'Trần Thị B',
      date: '2026-02-18',
      time: '14:00 - 16:00',
      duration: '8 Giờ 5 phút và gia',
      status: 'Đã duyệt',
      statusColor: 'green'
    }
  ];

    newMeetingPlans: MeetingPlan[] = [
    {
      id: '3',
      title: 'Hội nghị sơ kết 6 tháng đầu năm',
      level: 'Cấp Bộ',
      type: 'Trực tuyến',
      hostOrganization: 'Văn phòng Bộ',
      host: 'Nguyễn Văn A',
      date: '2026-03-01',
      time: '08:30 - 12:00',
      duration: '18 Giờ 5 phút và gia',
      status: 'Tạo mới',
      statusColor: 'default'
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
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'Đã duyệt');
        break;
      case 1: // Chờ phê duyệt
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'Chờ duyệt');
        break;
      case 2: // Từ chối
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'Từ chối');
        break;
      case 3: // Đã xóa
        this.filteredPlans = this.meetingPlans.filter(p => p.status === 'Đã xóa');
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
        plan.host.toLowerCase().includes(searchValue) ||
        plan.hostOrganization.toLowerCase().includes(searchValue)
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
}

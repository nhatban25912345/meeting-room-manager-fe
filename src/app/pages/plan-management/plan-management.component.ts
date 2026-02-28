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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MeetingService, MeetingData } from '../../services/meeting.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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
    NzMessageModule,
    NzModalModule
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
    cancelled: 0,
    newPlans: 0
  };

  filteredPlans: MeetingPlan[] = [];

  // Mapping tab index to status
  private tabStatusMap: { [key: number]: string } = {
    0: 'CREATED',
    1: 'PENDING_APPROVAL',
    2: 'APPROVED',
    3: 'REJECTED',
    4: 'CANCELED'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private meetingService: MeetingService,
    private message: NzMessageService,
    private modal: NzModalService
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
      size: 20,
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
              case 0: this.tabCounts.newPlans = count; break;
              case 1: this.tabCounts.pending = count; break;
              case 2: this.tabCounts.approved = count; break;
              case 3: this.tabCounts.rejected = count; break;
              case 4: this.tabCounts.cancelled = count; break;
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
    this.loadMeetings();
  }

  createNewPlan(): void {
    // Navigate to create new plan page
    this.router.navigate(['/home/bookings-new']);
  }

  viewPlan(plan: MeetingPlan): void {
    console.log('View plan:', plan);
    // TODO: Navigate to detail view or open modal
  }

  editPlan(plan: MeetingPlan): void {
    console.log('Edit plan:', plan);
    // TODO: Navigate to edit page or open edit modal
  }

  submitForApproval(plan: MeetingPlan): void {
    this.modal.confirm({
      nzTitle: 'Gửi phê duyệt',
      nzContent: `Bạn có chắc chắn muốn gửi cuộc họp "${plan.title}" để phê duyệt?`,
      nzOkText: 'Gửi',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        this.loading = true;
        this.meetingService.submitForApproval(plan.id).subscribe({
          next: () => {
            this.message.success('Gửi phê duyệt thành công');
            this.loadMeetings();
            this.loadTabCounts();
          },
          error: (error) => {
            console.error('Error submitting for approval:', error);
            this.message.error('Gửi phê duyệt thất bại');
            this.loading = false;
          }
        });
      }
    });
  }

  approvePlan(plan: MeetingPlan): void {
    this.modal.confirm({
      nzTitle: 'Phê duyệt cuộc họp',
      nzContent: `Bạn có chắc chắn muốn phê duyệt cuộc họp "${plan.title}"?`,
      nzOkText: 'Phê duyệt',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        this.loading = true;
        this.meetingService.approveMeeting(plan.id).subscribe({
          next: () => {
            this.message.success('Phê duyệt thành công');
            this.loadMeetings();
            this.loadTabCounts();
          },
          error: (error) => {
            console.error('Error approving meeting:', error);
            this.message.error('Phê duyệt thất bại');
            this.loading = false;
          }
        });
      }
    });
  }

  rejectPlan(plan: MeetingPlan): void {
    let rejectReason = '';
    this.modal.confirm({
      nzTitle: 'Từ chối cuộc họp',
      nzContent: `
        <p>Bạn có chắc chắn muốn từ chối cuộc họp "${plan.title}"?</p>
        <nz-form-item>
          <nz-form-label>Lý do từ chối (tùy chọn)</nz-form-label>
          <textarea nz-input id="rejectReason" rows="3" placeholder="Nhập lý do từ chối..."></textarea>
        </nz-form-item>
      `,
      nzOkText: 'Từ chối',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        const reasonInput = document.getElementById('rejectReason') as HTMLTextAreaElement;
        rejectReason = reasonInput?.value || '';
        
        this.loading = true;
        this.meetingService.rejectMeeting(plan.id, rejectReason).subscribe({
          next: () => {
            this.message.success('Từ chối cuộc họp thành công');
            this.loadMeetings();
            this.loadTabCounts();
          },
          error: (error) => {
            console.error('Error rejecting meeting:', error);
            this.message.error('Từ chối cuộc họp thất bại');
            this.loading = false;
          }
        });
      }
    });
  }

  cancelPlan(plan: MeetingPlan): void {
    let cancelReason = '';
    this.modal.confirm({
      nzTitle: 'Hủy cuộc họp',
      nzContent: `
        <p>Bạn có chắc chắn muốn hủy cuộc họp "${plan.title}"?</p>
        <nz-form-item>
          <nz-form-label>Lý do hủy (tùy chọn)</nz-form-label>
          <textarea nz-input id="cancelReason" rows="3" placeholder="Nhập lý do hủy..."></textarea>
        </nz-form-item>
      `,
      nzOkText: 'Hủy cuộc họp',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Đóng',
      nzOnOk: () => {
        const reasonInput = document.getElementById('cancelReason') as HTMLTextAreaElement;
        cancelReason = reasonInput?.value || '';
        
        this.loading = true;
        this.meetingService.cancelMeeting(plan.id, cancelReason).subscribe({
          next: () => {
            this.message.success('Hủy cuộc họp thành công');
            this.loadMeetings();
            this.loadTabCounts();
          },
          error: (error) => {
            console.error('Error canceling meeting:', error);
            this.message.error('Hủy cuộc họp thất bại');
            this.loading = false;
          }
        });
      }
    });
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

import { Component, Output, EventEmitter, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { PermissionModalComponent, PermissionChangeData } from '../permission-modal/permission-modal.component';
import { EmployeeDetailModalComponent } from '../employee-detail-modal/employee-detail-modal.component';

interface Employee {
  userId: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  unitCode: string;
  jobTitle: string;
  roleCode: string;
  status: number;
}

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzTableModule,
    NzAvatarModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzMessageModule,
    PermissionModalComponent,
    EmployeeDetailModalComponent
  ],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit {
  @Output() employeeCountChange = new EventEmitter<number>();
  @Input() filterCriteria: any = {};

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);

  // Pagination state
  pageIndex = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  total = 0;
  loading = false;

  employees: Employee[] = [];

  // Permission modal state
  permissionModalVisible = false;
  selectedEmployee: Employee | null = null;
  isSubmittingPermission = false;

  // Detail modal state
  detailModalVisible = false;
  detailEmployee: Employee | null = null;

  searchText = '';
  selectedRole = 'Tất cả';
  selectedStatus = 'Tất cả';
  roles = ['Tất cả', 'Quản trị viên', 'Quản lý', 'Nhân viên'];
  statuses = ['Tất cả', 'Đang làm việc', 'Đã nghỉ việc', 'Đang bận'];

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.message.error('Không tìm thấy token xác thực');
      return;
    }

    this.loading = true;

    // Map filter criteria to API format
    const filter: any = {};
    if (this.filterCriteria.user_id) filter.userId = Number(this.filterCriteria.user_id);
    if (this.filterCriteria.full_name) filter.fullName = this.filterCriteria.full_name;
    if (this.filterCriteria.phone_number) filter.phoneNumber = this.filterCriteria.phone_number;
    if (this.filterCriteria.email) filter.email = this.filterCriteria.email;
    if (this.filterCriteria.unit_code) filter.unitCode = this.filterCriteria.unit_code;
    if (this.filterCriteria.job_title) filter.jobTitle = this.filterCriteria.job_title;
    if (this.filterCriteria.role_code) filter.roleCode = this.filterCriteria.role_code;
    if (this.filterCriteria.status !== null && this.filterCriteria.status !== undefined) {
      filter.status = this.filterCriteria.status;
    }

    this.userService.searchUsers(
      filter,
      this.pageIndex - 1, // API uses 0-based index
      this.pageSize,
      'userId,asc',
      token
    ).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status?.statusCode === 'SUCCESS' && response.data) {
          this.employees = response.data.content || [];
          this.total = response.data.totalElements || 0;
          this.employeeCountChange.emit(this.total);
          this.message.success('Đã áp dụng bộ lọc');
        } else {
          this.message.error(response.status?.displayMessage || 'Lỗi khi tải dữ liệu');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading employees:', error);
        this.message.error('Lỗi khi tải dữ liệu nhân viên');
      }
    });
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadEmployees();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadEmployees();
  }

  getStatusTag(status: number): { color: string; text: string } {
    switch (status) {
      case 0:
        return { color: 'default', text: 'Đã nghỉ việc' };
      case 1:
        return { color: 'success', text: 'Đang làm việc' };
      case 2:
        return { color: 'warning', text: 'Đang bận' };
      default:
        return { color: 'default', text: 'Không xác định' };
    }
  }

  // Permission modal methods
  openPermissionModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.permissionModalVisible = true;
  }

  closePermissionModal(): void {
    this.permissionModalVisible = false;
    this.selectedEmployee = null;
  }

  handlePermissionChange(data: PermissionChangeData): void {
    this.isSubmittingPermission = true;
    
    // TODO: Call API to update user permission
    console.log('Updating permission:', data);
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmittingPermission = false;
      this.message.success(`Đã cập nhật quyền thành công cho người dùng ${data.userId}`);
      this.closePermissionModal();
      this.loadEmployees(); // Reload data after permission change
    }, 1000);
  }

  // Detail modal methods
  openDetailModal(employee: Employee): void {
    this.detailEmployee = employee;
    this.detailModalVisible = true;
  }

  closeDetailModal(): void {
    this.detailModalVisible = false;
    this.detailEmployee = null;
  }
}

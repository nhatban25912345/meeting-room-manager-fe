import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { EmployeeFilterComponent } from "./employee-filter/employee-filter.component";
import { EmployeeFormModalComponent, CreateEmployeeRequest } from './employee-form-modal/employee-form-modal.component';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeTableComponent,
    EmployeeFilterComponent,
    EmployeeFormModalComponent,
    NzMessageModule,
    NzButtonModule
  ],
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent {
  @ViewChild(EmployeeTableComponent) employeeTable!: EmployeeTableComponent;
  
  private message = inject(NzMessageService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  
  employeeCount = 0;

  // Form modal state
  formModalVisible = false;
  isSubmittingForm = false;

  filterCriteria = {
    user_id: '',
    full_name: '',
    phone_number: '',
    email: '',
    unit_code: null,
    job_title: null,
    role_code: null,
    status: null
  };

  onApplyFilter() {
    if (this.employeeTable) {
      this.employeeTable.pageIndex = 1; // Reset to first page when applying filter
      this.employeeTable.loadEmployees();
      this.message.success('Đã áp dụng bộ lọc');
    }
  }

  onResetFilter() {
    this.filterCriteria = {
      user_id: '',
      full_name: '',
      phone_number: '',
      email: '',
      unit_code: null,
      job_title: null,
      role_code: null,
      status: null
    };
  }

  onExportData() {
    // TODO: Implement export functionality
    console.log('Export data');
  }

  // Form modal methods
  openFormModal() {
    this.formModalVisible = true;
  }

  closeFormModal() {
    this.formModalVisible = false;
  }

  handleCreateEmployee(request: CreateEmployeeRequest) {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.message.error('Không tìm thấy token xác thực');
      return;
    }

    this.isSubmittingForm = true;

    this.userService.createUser(request, token).subscribe({
      next: (response) => {
        this.isSubmittingForm = false;
        if (response.status?.statusCode === 'SUCCESS') {
          this.message.success('Thêm nhân viên thành công!');
          this.closeFormModal();
          // Reload employee table
          if (this.employeeTable) {
            this.employeeTable.loadEmployees();
          }
        } else {
          this.message.error(response.status?.displayMessage || 'Lỗi khi thêm nhân viên');
        }
      },
      error: (error) => {
        this.isSubmittingForm = false;
        console.error('Error creating employee:', error);
        const errorMessage = error.error?.status?.displayMessage || 'Lỗi khi thêm nhân viên';
        this.message.error(errorMessage);
      }
    });
  }
}

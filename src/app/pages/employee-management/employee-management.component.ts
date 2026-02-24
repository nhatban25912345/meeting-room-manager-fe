import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
// Update the import path below if the actual path is different
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { EmployeeFilterComponent } from "./employee-filter/employee-filter.component";

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, EmployeeTableComponent, EmployeeFilterComponent],
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent {
  employeeCount = 0;
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
  users: any[] = [];
  total = 0;
  page = 0;
  size = 10;
  loading = false;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    const token = localStorage.getItem('accessToken') || '';
    // Map filterCriteria to API body
    const body: any = {
      userId: this.filterCriteria.user_id || undefined,
      fullName: this.filterCriteria.full_name || undefined,
      phoneNumber: this.filterCriteria.phone_number || undefined,
      email: this.filterCriteria.email || undefined,
      unitCode: this.filterCriteria.unit_code || undefined,
      jobTitle: this.filterCriteria.job_title || undefined,
      roleCode: this.filterCriteria.role_code || undefined,
      status: this.filterCriteria.status !== null ? this.filterCriteria.status : undefined
    };
    this.userService.searchUsers(body, this.page, this.size, 'userId,asc', token)
      .subscribe({
        next: (res) => {
          this.users = res?.data?.content || [];
          this.total = res?.data?.totalElements || 0;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
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
    this.page = 0;
    this.fetchUsers();
  }

  onApplyFilter() {
    this.page = 0;
    this.fetchUsers();
  }

  onPageChange(page: number) {
    this.page = page;
    this.fetchUsers();
  }

  onPageSizeChange(size: number) {
    this.size = size;
    this.page = 0;
    this.fetchUsers();
  }
}

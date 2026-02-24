import { Component } from '@angular/core';
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
}

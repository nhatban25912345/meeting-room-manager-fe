import { Component, ViewChild } from '@angular/core';
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
  @ViewChild(EmployeeTableComponent) employeeTable!: EmployeeTableComponent;

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

  onApplyFilter() {
    if (this.employeeTable) {
      this.employeeTable.pageIndex = 1; // Reset to first page when applying filter
      this.employeeTable.loadEmployees();
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
    if (this.employeeTable) {
      this.employeeTable.pageIndex = 1;
      this.employeeTable.loadEmployees();
    }
  }

  onExportData() {
    // TODO: Implement export functionality
    console.log('Export data');
  }
}

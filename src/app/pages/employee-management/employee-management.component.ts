import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeTableComponent } from './employee-table/employee-table.component';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, EmployeeTableComponent],
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent {
  employeeCount = 0;
}

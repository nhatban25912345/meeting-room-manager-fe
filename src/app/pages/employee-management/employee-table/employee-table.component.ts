import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  status: 'Sẵn sàng' | 'Đang bận' | 'Nghỉ phép';
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
    NzIconModule
  ],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent implements OnInit {
    @Output() employeeCountChange = new EventEmitter<number>();
  // Pagination state
  pageIndex = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50];
  total = 0;

  ngOnInit(): void {
    this.total = this.filteredEmployees.length;
    this.employeeCountChange.emit(this.total);
  }
  employees: Employee[] = [
    { id: 'A', name: 'Nguyễn Văn A', role: 'Quản trị viên', department: 'Văn phòng Bộ', phone: '0901-xxx-xxx', status: 'Sẵn sàng' },
    { id: 'B', name: 'Trần Thị B', role: 'Kỹ thuật viên', department: 'Cục CNTT', phone: '0902-xxx-xxx', status: 'Sẵn sàng' },
    { id: 'C', name: 'Lê Văn C', role: 'Điều phối viên', department: 'Vụ Kế hoạch', phone: '0903-xxx-xxx', status: 'Sẵn sàng' },
    { id: 'D', name: 'Phạm Văn D', role: 'Kỹ thuật viên', department: 'Trung tâm Kỹ thuật', phone: '0904-xxx-xxx', status: 'Đang bận' },
    { id: 'E', name: 'Hoàng Văn E', role: 'Thư ký', department: 'Văn phòng Bộ', phone: '0905-xxx-xxx', status: 'Sẵn sàng' },
    { id: 'F', name: 'Trần Văn F', role: 'Kỹ thuật viên', department: 'Trung tâm Truyền hình', phone: '0906-xxx-xxx', status: 'Nghỉ phép' },
  ];
  searchText = '';
  selectedRole = 'Tất cả';
  selectedStatus = 'Tất cả';
  get filteredEmployees() {
    const filtered = this.employees.filter(e =>
      (this.selectedRole === 'Tất cả' || e.role === this.selectedRole) &&
      (this.selectedStatus === 'Tất cả' || e.status === this.selectedStatus) &&
      (e.name.toLowerCase().includes(this.searchText.toLowerCase()) || e.phone.includes(this.searchText))
    );
    this.total = filtered.length;
    this.employeeCountChange.emit(this.total);
    // Pagination
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  onPageIndexChange(index: number) {
    this.pageIndex = index;
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1;
  }
  roles = ['Tất cả', 'Quản trị viên', 'Kỹ thuật viên', 'Điều phối viên', 'Thư ký'];
  statuses = ['Tất cả', 'Sẵn sàng', 'Đang bận', 'Nghỉ phép'];
}

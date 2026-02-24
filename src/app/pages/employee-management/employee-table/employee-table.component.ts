import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
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
  @Input() users: any[] = [];
  @Input() total = 0;
  @Input() page = 0;
  @Input() size = 10;
  @Input() loading = false;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  ngOnInit(): void {
    this.total = this.users.length;
    this.employeeCountChange.emit(this.total);
  }

  selectedRole = 'Tất cả';
  selectedStatus = 'Tất cả';

  onPageIndexChange(index: number) {
    this.pageChange.emit(index);
  }

  onPageSizeChange(size: number) {
    this.pageSizeChange.emit(size);
  }
  roles = ['Tất cả', 'Quản trị viên', 'Quản lý', 'Nhân viên'];
  statuses = ['Tất cả', 'Đang làm việc', 'Đã nghỉ việc', 'Đang bận'];
}

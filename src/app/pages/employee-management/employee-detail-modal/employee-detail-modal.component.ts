import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

export interface EmployeeDetail {
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
  selector: 'app-employee-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzDescriptionsModule,
    NzTagModule,
    NzDividerModule,
    NzIconModule,
    NzAvatarModule
  ],
  templateUrl: './employee-detail-modal.component.html',
  styleUrl: './employee-detail-modal.component.scss'
})
export class EmployeeDetailModalComponent {
  @Input() visible = false;
  @Input() employee: EmployeeDetail | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter<void>();

  handleClose(): void {
    this.onClose.emit();
  }

  getStatusInfo(status: number): { color: string; text: string } {
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

  getRoleLabel(roleCode: string): string {
    const roleMap: Record<string, string> = {
      'ADMIN': 'Quản trị viên',
      'MANAGER': 'Quản lý',
      'EMPLOYEE': 'Nhân viên'
    };
    return roleMap[roleCode] || roleCode;
  }
}

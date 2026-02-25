import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface PermissionChangeData {
  userId: number;
  roleCode: string;
}

@Component({
  selector: 'app-permission-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzAlertModule,
    NzDividerModule,
    NzIconModule
  ],
  templateUrl: './permission-modal.component.html',
  styleUrl: './permission-modal.component.scss'
})
export class PermissionModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() selectedUser: any = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<PermissionChangeData>();
  @Output() onCancel = new EventEmitter<void>();

  permissionForm!: FormGroup;

  roleOptions = [
    { value: 'ADMIN', label: 'Quản trị viên', description: 'Toàn quyền quản lý hệ thống' },
    { value: 'MANAGER', label: 'Quản lý', description: 'Quản lý phòng họp và nhân viên' },
    { value: 'EMPLOYEE', label: 'Nhân viên', description: 'Người dùng thông thường' }
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue && this.selectedUser) {
      this.permissionForm.patchValue({
        roleCode: this.selectedUser.roleCode
      });
    }
  }

  initForm(): void {
    this.permissionForm = this.fb.group({
      roleCode: ['', [Validators.required]]
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  handleOk(): void {
    if (this.permissionForm.valid && this.selectedUser) {
      const data: PermissionChangeData = {
        userId: this.selectedUser.userId,
        roleCode: this.permissionForm.value.roleCode
      };
      this.onSubmit.emit(data);
    } else {
      Object.values(this.permissionForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getRoleDescription(roleCode: string): string {
    const role = this.roleOptions.find(r => r.value === roleCode);
    return role ? role.description : '';
  }
}

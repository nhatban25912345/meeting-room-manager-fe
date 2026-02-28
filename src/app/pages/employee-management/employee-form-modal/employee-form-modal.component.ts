import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';

export interface CreateEmployeeRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  unitCode: string;
  jobTitle: string;
  roleCode: string;
}

@Component({
  selector: 'app-employee-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,
    NzGridModule
  ],
  templateUrl: './employee-form-modal.component.html',
  styleUrl: './employee-form-modal.component.scss'
})
export class EmployeeFormModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<CreateEmployeeRequest>();
  @Output() onCancel = new EventEmitter<void>();

  employeeForm!: FormGroup;
  passwordVisible = false;

  roleOptions = [
    { value: 'ADMIN', label: 'Quản trị viên' },
    { value: 'MANAGER', label: 'Quản lý' },
    { value: 'EMPLOYEE', label: 'Nhân viên' }
  ];

  unitOptions = [
    { value: 'UNIT01', label: 'Phòng Hành chính' },
    { value: 'UNIT02', label: 'Phòng Kỹ thuật' },
    { value: 'UNIT03', label: 'Phòng Kinh doanh' },
    { value: 'UNIT04', label: 'Phòng Nhân sự' },
    { value: 'UNIT05', label: 'Phòng Tài chính' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue === false) {
      this.resetForm();
    }
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      unitCode: ['', Validators.required],
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      roleCode: ['EMPLOYEE', Validators.required]
    });
  }

  resetForm(): void {
    this.employeeForm.reset({
      roleCode: 'EMPLOYEE'
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  handleSubmit(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const { firstName, lastName, ...rest } = formValue;
      const requestData: CreateEmployeeRequest = {
        ...rest,
        fullName: `${firstName} ${lastName}`.trim()
      };
      this.onSubmit.emit(requestData);
    } else {
      Object.values(this.employeeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-room-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule
  ],
  templateUrl: './room-form-modal.component.html',
  styleUrl: './room-form-modal.component.scss'
})
export class RoomFormModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() currentUsername = 'admin';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  roomForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue) {
      this.resetForm();
    }
  }

  initForm(): void {
    this.roomForm = this.fb.group({
      roomCode: ['', [Validators.required]],
      roomName: ['', [Validators.required]],
      location: [''],
      capacity: [null, [Validators.required, Validators.min(1)]],
      managementUnitName: [''],
      transmissionConfig: [''],
      roomType: ['OFFLINE', [Validators.required]],
      status: ['AVAILABLE', [Validators.required]],
      notes: [''],
      createdBy: [this.currentUsername],
      updatedBy: [this.currentUsername]
    });
  }

  resetForm(): void {
    this.roomForm.reset({
      roomType: 'OFFLINE',
      status: 'AVAILABLE',
      createdBy: this.currentUsername,
      updatedBy: this.currentUsername
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  handleOk(): void {
    if (this.roomForm.valid) {
      this.onSubmit.emit(this.roomForm.value);
    } else {
      Object.values(this.roomForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoomService } from '../../../services/room.service';
import { UserService } from '../../employee-management/services/user.service';
import { MeetingService, CreateMeetingRequest } from '../../../services/meeting.service';

@Component({
  selector: 'app-meeting-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzIconModule,
    NzUploadModule
  ],
  templateUrl: './meeting-form.component.html',
  styleUrl: './meeting-form.component.scss'
})
export class MeetingFormComponent implements OnInit {
  meetingForm!: FormGroup;
  showFilterPanel = true;

  // Dropdown options
  roomCodeOptions: Array<{ value: string; label: string }> = [];
  participantOptions: Array<{ value: number; label: string }> = [];

  organizingUnitOptions = [
    { value: 'van-phong-bo', label: 'Văn phòng Bộ' },
    { value: 'vu-ke-hoach', label: 'Vụ Kế hoạch' },
    { value: 'vu-tai-chinh', label: 'Vụ Tài chính' },
    { value: 'vu-to-chuc', label: 'Vụ Tổ chức' }
  ];

  recurringScheduleOptions = [
    { value: 'none', label: 'Không định kỳ' },
    { value: 'daily', label: 'Hàng ngày' },
    { value: 'weekly', label: 'Hàng tuần' },
    { value: 'monthly', label: 'Hàng tháng' }
  ];

  dressCodeOptions = [
    { value: 'casual', label: 'Thường phục' },
    { value: 'formal', label: 'Trang trọng' },
    { value: 'business', label: 'Công sở' }
  ];

  meetingTypeOptions = [
    { value: 'non-recurring', label: 'Không định kỳ' },
    { value: 'recurring', label: 'Định kỳ' }
  ];

  conclusionUnitOptions = [
    { value: 'van-phong-bo', label: 'Văn phòng Bộ' },
    { value: 'vu-ke-hoach', label: 'Vụ Kế hoạch' },
    { value: 'vu-tai-chinh', label: 'Vụ Tài chính' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private roomService: RoomService,
    private userService: UserService,
    private meetingService: MeetingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupValidators();
    this.loadAvailableRooms();
    this.loadParticipants();
  }

  initForm(): void {
    this.meetingForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.maxLength(1000)]],
      roomCode: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      meetingDate: [null, [Validators.required, this.dateNotInPastValidator]],
      organizingUnit: [null, [Validators.required]],
      note: [''],
      recurringSchedule: [null],
      dressCode: [null, [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]],
      meetingType: [null, [Validators.required]],
      conclusionUnit: [null],
      participants: [[], [Validators.required]],
      attachedFile: [null],
      preparationTask: [null]
    });
  }

  setupValidators(): void {
    // Listen to changes in date and time fields to validate time range
    this.meetingForm.get('startTime')?.valueChanges.subscribe(() => {
      this.validateTimeRange();
    });

    this.meetingForm.get('endTime')?.valueChanges.subscribe(() => {
      this.validateTimeRange();
    });
  }

  loadAvailableRooms(): void {
    this.roomService.getAvailableRooms().subscribe({
      next: (response) => {
        if (response.status.statusCode === 'SUCCESS' && response.data) {
          this.roomCodeOptions = response.data.map(room => ({
            value: room.roomCode,
            label: `${room.roomCode} - ${room.roomName} - ${room.location}`
          }));
        }
      },
      error: (error) => {
        console.error('Error loading available rooms:', error);
        this.message.error('Không thể tải danh sách phòng họp');
      }
    });
  }

  loadParticipants(): void {
    this.userService.getAllParticipants().subscribe({
      next: (response: any) => {
        if (response.status.statusCode === 'SUCCESS' && response.data) {
          this.participantOptions = response.data.map((user: any) => ({
            value: user.userId,
            label: `${user.fullName} (${user.userId})`
          }));
        }
      },
      error: (error: any) => {
        console.error('Error loading participants:', error);
        this.message.error('Không thể tải danh sách nhân viên');
      }
    });
  }

  // Custom validator: Date must not be in the past
  dateNotInPastValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { dateInPast: true };
    }

    return null;
  }

  // Validate that end time is after start time
  validateTimeRange(): void {
    const startTime = this.meetingForm.get('startTime')?.value;
    const endTime = this.meetingForm.get('endTime')?.value;

    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end <= start) {
        this.meetingForm.get('endTime')?.setErrors({ endTimeBeforeStart: true });
      } else {
        // Clear the custom error if times are valid
        const endTimeControl = this.meetingForm.get('endTime');
        if (endTimeControl?.hasError('endTimeBeforeStart')) {
          endTimeControl.setErrors(null);
        }
      }
    }
  }

  onTogglePanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  onSubmit(): void {
    if (this.meetingForm.valid) {
      const formValue = this.meetingForm.getRawValue();
      
      // Transform form data to API request format
      const request: CreateMeetingRequest = {
        subject: formValue.subject,
        content: formValue.content,
        roomCode: formValue.roomCode,
        startTime: this.formatTimeToString(formValue.startTime),
        endTime: this.formatTimeToString(formValue.endTime),
        meetingDate: this.formatDateToString(formValue.meetingDate),
        organizerUnit: formValue.organizingUnit,
        meetingHost: formValue.participants && formValue.participants.length > 0 
          ? formValue.participants[0].toString() 
          : '1000', // Default to first participant or fallback
        contactEmail: formValue.contactEmail,
        dressCode: formValue.dressCode,
        scheduleType: this.mapScheduleType(formValue.meetingType),
        participantUserIds: formValue.participants.map((id: number) => id.toString())
      };

      // Add optional fields
      if (formValue.note) {
        request.note = formValue.note;
      }
      if (formValue.conclusionUnit) {
        request.conclusionUnit = formValue.conclusionUnit;
      }
      if (formValue.recurringSchedule && formValue.recurringSchedule !== 'none') {
        request.recurrencePattern = formValue.recurringSchedule;
      }
      if (formValue.attachedFile) {
        request.attachment = formValue.attachedFile;
      }
      if (formValue.preparationTask) {
        request.preparationTasks = formValue.preparationTask;
      }

      // Call API to create meeting
      this.meetingService.createMeeting(request).subscribe({
        next: (response) => {
          if (response.status.statusCode === 'SUCCESS') {
            this.message.success('Tạo mới lịch họp thành công!');
            setTimeout(() => {
              this.router.navigate(['/meeting-management/plan-management']);
            }, 1000);
          } else {
            this.message.error(response.status.displayMessage || 'Tạo lịch họp thất bại!');
          }
        },
        error: (error) => {
          console.error('Error creating meeting:', error);
          this.message.error('Không thể tạo lịch họp. Vui lòng thử lại!');
        }
      });
    } else {
      Object.values(this.meetingForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  }

  onCreateNewPlan(): void {
    const formValue = {
      ...this.meetingForm.getRawValue()
    };
    console.log('New plan saved:', formValue);
    this.message.success('Tạo mới thành công!');
    // TODO: Call API to save new plan
  }

  onCancel(): void {
    this.router.navigate(['/meeting-management/plan-management']);
  }

  /**
   * Format Date object to YYYY-MM-DD string
   */
  private formatDateToString(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format Date object to HH:mm:ss string
   */
  private formatTimeToString(time: Date): string {
    if (!time) return '';
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Map meeting type to schedule type
   */
  private mapScheduleType(meetingType: string): string {
    // Convert 'non-recurring' to 'non_recurring', 'recurring' stays the same
    return meetingType === 'non-recurring' ? 'non_recurring' : 'recurring';
  }

  // File upload handlers
  beforeUpload = (file: any): boolean => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.message.error('Kích thước file không được vượt quá 10MB!');
    }
    return isLt10M;
  };

  handleAttachmentChange(info: any): void {
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} đã được tải lên thành công`);
      this.meetingForm.patchValue({ attachedFile: info.file });
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} tải lên thất bại.`);
    }
  }

  handlePreparationChange(info: any): void {
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} đã được tải lên thành công`);
      this.meetingForm.patchValue({ preparationTask: info.file });
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} tải lên thất bại.`);
    }
  }
}

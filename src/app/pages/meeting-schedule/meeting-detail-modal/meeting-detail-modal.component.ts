import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MeetingData } from '../../../services/meeting.service';

@Component({
  selector: 'app-meeting-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzDescriptionsModule,
    NzTagModule,
    NzDividerModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './meeting-detail-modal.component.html',
  styleUrl: './meeting-detail-modal.component.scss'
})
export class MeetingDetailModalComponent {
  @Input() meeting: MeetingData | null = null;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  handleClose(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // HH:mm:ss -> HH:mm
  }

  formatDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  getStatusColor(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CREATED': 'default',
      'PENDING_APPROVAL': 'blue',
      'APPROVED': 'green',
      'REJECTED': 'red',
      'CANCELED': 'gray'
    };
    return statusMap[status] || 'default';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'CREATED': 'Tạo mới',
      'PENDING_APPROVAL': 'Chờ duyệt',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối',
      'CANCELED': 'Hủy'
    };
    return labelMap[status] || status;
  }

  getScheduleTypeLabel(type: string): string {
    return type === 'recurring' ? 'Định kỳ' : 'Không định kỳ';
  }
}

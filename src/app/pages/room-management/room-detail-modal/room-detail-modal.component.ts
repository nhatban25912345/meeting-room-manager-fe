import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RoomData } from '../../../services/room.service';

@Component({
  selector: 'app-room-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzDescriptionsModule,
    NzTagModule,
    NzDividerModule,
    NzIconModule
  ],
  templateUrl: './room-detail-modal.component.html',
  styleUrls: ['./room-detail-modal.component.scss']
})
export class RoomDetailModalComponent {
  @Input() visible = false;
  @Input() room: RoomData | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  handleCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'AVAILABLE': 'Khả dụng',
      'IN_USE': 'Đang sử dụng',
      'MAINTENANCE': 'Bảo trì',
      'UNAVAILABLE': 'Không khả dụng'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'AVAILABLE': 'green',
      'IN_USE': 'blue',
      'MAINTENANCE': 'orange',
      'UNAVAILABLE': 'red'
    };
    return colorMap[status] || 'default';
  }

  getRoomTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'OFFLINE': 'Trực tiếp',
      'ONLINE': 'Trực tuyến',
      'HYBRID': 'Kết hợp'
    };
    return typeMap[type] || type;
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Chưa có';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

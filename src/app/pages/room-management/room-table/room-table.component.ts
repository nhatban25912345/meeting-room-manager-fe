import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RoomData } from '../../../services/room.service';

@Component({
  selector: 'app-room-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzTagModule,
    NzToolTipModule
  ],
  templateUrl: './room-table.component.html',
  styleUrl: './room-table.component.scss'
})
export class RoomTableComponent {
  @Input() rooms: RoomData[] = [];
  @Input() loading = false;
  @Input() total = 0;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [];
  @Input() sortField = 'roomCode';
  @Input() sortOrder = 'asc';
  @Input() sortFieldOptions: any[] = [];
  @Input() sortOrderOptions: any[] = [];
  
  @Output() pageIndexChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() sortFieldChange = new EventEmitter<string>();
  @Output() sortOrderChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<void>();
  @Output() viewRoom = new EventEmitter<RoomData>();
  @Output() editRoom = new EventEmitter<RoomData>();
  @Output() deleteRoom = new EventEmitter<RoomData>();

  onPageIndexChange(pageIndex: number): void {
    this.pageIndexChange.emit(pageIndex);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  onSortFieldChange(value: string): void {
    this.sortField = value;
    this.sortFieldChange.emit(value);
    this.sortChange.emit();
  }

  onSortOrderChange(value: string): void {
    this.sortOrder = value;
    this.sortOrderChange.emit(value);
    this.sortChange.emit();
  }

  onViewRoom(room: RoomData): void {
    this.viewRoom.emit(room);
  }

  onEditRoom(room: RoomData): void {
    this.editRoom.emit(room);
  }

  onDeleteRoom(room: RoomData): void {
    this.deleteRoom.emit(room);
  }

  getStatusText(status: string): string {
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
      'AVAILABLE': 'success',
      'IN_USE': 'warning',
      'MAINTENANCE': 'error',
      'UNAVAILABLE': 'default'
    };
    return colorMap[status] || 'default';
  }
}

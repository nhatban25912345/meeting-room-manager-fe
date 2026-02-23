import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageService } from 'ng-zorro-antd/message';

interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  equipment: string[];
  status: 'available' | 'in-use' | 'maintenance';
}

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule,
    NzDropDownModule,
    NzModalModule,
    NzToolTipModule
  ],
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.scss'
})
export class RoomManagementComponent implements OnInit {
  searchText = '';
  filterStatus = 'all';
  
  rooms: Room[] = [
    {
      id: 'P.101',
      name: 'Hội trường lớn',
      capacity: 200,
      floor: 1,
      equipment: ['Máy chiếu', 'Micro', 'Camera'],
      status: 'available'
    },
    {
      id: 'P.201',
      name: 'Phòng họp A',
      capacity: 30,
      floor: 2,
      equipment: ['Màn hình LED', 'Micro'],
      status: 'in-use'
    },
    {
      id: 'P.301',
      name: 'Phòng họp B',
      capacity: 20,
      floor: 3,
      equipment: ['Máy chiếu', 'Micro'],
      status: 'available'
    },
    {
      id: 'P.401',
      name: 'Phòng họp VIP',
      capacity: 15,
      floor: 4,
      equipment: ['Hệ thống Polycom', 'Màn hình LED'],
      status: 'maintenance'
    },
    {
      id: 'P.501',
      name: 'Phòng đa năng',
      capacity: 50,
      floor: 5,
      equipment: ['Máy chiếu', 'Micro', 'Camera', 'Bảng kương lặc'],
      status: 'available'
    }
  ];

  filteredRooms: Room[] = [];

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    this.filteredRooms = [...this.rooms];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredRooms = this.rooms.filter(room => {
      const matchSearch = !this.searchText || 
        room.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
        room.name.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchStatus = this.filterStatus === 'all' || room.status === this.filterStatus;
      
      return matchSearch && matchStatus;
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'available': 'Trống',
      'in-use': 'Đang sử dụng',
      'maintenance': 'Bảo trì'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'available': 'success',
      'in-use': 'warning',
      'maintenance': 'error'
    };
    return colorMap[status] || 'default';
  }

  onAddRoom(): void {
    this.message.info('Chức năng đang được phát triển');
  }

  onViewRoom(room: Room): void {
    this.message.info(`Xem chi tiết phòng ${room.id}`);
  }

  onEditRoom(room: Room): void {
    this.message.info(`Chỉnh sửa phòng ${room.id}`);
  }

  onDeleteRoom(room: Room): void {
    this.message.warning(`Xóa phòng ${room.id}`);
  }
}

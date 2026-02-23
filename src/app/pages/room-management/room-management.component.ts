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
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';

interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  equipment: string[];
  status: 'available' | 'in-use' | 'maintenance';
  roomType?: 'OFFLINE' | 'ONLINE';
}

interface FilterCriteria {
  roomCode: string;
  roomName: string;
  capacityRange: string;
  roomType: string;
  status: string;
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
    NzToolTipModule,
    NzFormModule
  ],
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.scss'
})
export class RoomManagementComponent implements OnInit {
  searchText = '';
  filterStatus = 'all';
  showFilterPanel = true;
  
  // Pagination
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  pageSizeOptions = [5, 10, 20, 50, 100];
  
  // Filter criteria
  filterCriteria: FilterCriteria = {
    roomCode: '',
    roomName: '',
    capacityRange: 'all',
    roomType: 'all',
    status: 'all'
  };

  // Dropdown options
  capacityRangeOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: '0-10 người', value: '0-10' },
    { label: '10-20 người', value: '10-20' },
    { label: '20-50 người', value: '20-50' },
    { label: '50-100 người', value: '50-100' },
    { label: 'Trên 100 người', value: '100+' }
  ];

  roomTypeOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Trực tiếp', value: 'OFFLINE' },
    { label: 'Trực tuyến', value: 'ONLINE' }
  ];

  statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Khả dụng', value: 'AVAILABLE' },
    { label: 'Đang sử dụng', value: 'IN_USE' },
    { label: 'Bảo trì', value: 'MAINTENANCE' },
    { label: 'Không khả dụng', value: 'UNAVAILABLE' }
  ];
  
  rooms: Room[] = [
    {
      id: 'P.101',
      name: 'Hội trường lớn',
      capacity: 200,
      floor: 1,
      equipment: ['Máy chiếu', 'Micro', 'Camera'],
      status: 'available',
      roomType: 'OFFLINE'
    },
    {
      id: 'P.201',
      name: 'Phòng họp A',
      capacity: 30,
      floor: 2,
      equipment: ['Màn hình LED', 'Micro'],
      status: 'in-use',
      roomType: 'OFFLINE'
    },
    {
      id: 'P.301',
      name: 'Phòng họp B',
      capacity: 20,
      floor: 3,
      equipment: ['Máy chiếu', 'Micro'],
      status: 'available',
      roomType: 'OFFLINE'
    },
    {
      id: 'P.401',
      name: 'Phòng họp VIP',
      capacity: 15,
      floor: 4,
      equipment: ['Hệ thống Polycom', 'Màn hình LED'],
      status: 'maintenance',
      roomType: 'ONLINE'
    },
    {
      id: 'P.501',
      name: 'Phòng đa năng',
      capacity: 50,
      floor: 5,
      equipment: ['Máy chiếu', 'Micro', 'Camera', 'Bảng kương lặc'],
      status: 'available',
      roomType: 'OFFLINE'
    }
  ];

  filteredRooms: Room[] = [];

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    this.filteredRooms = [...this.rooms];
    this.total = this.filteredRooms.length;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredRooms = this.rooms.filter(room => {
      // Search text filter
      const matchSearch = !this.searchText || 
        room.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
        room.name.toLowerCase().includes(this.searchText.toLowerCase());
      
      // Room code filter
      const matchRoomCode = !this.filterCriteria.roomCode || 
        room.id.toLowerCase().includes(this.filterCriteria.roomCode.toLowerCase());
      
      // Room name filter
      const matchRoomName = !this.filterCriteria.roomName || 
        room.name.toLowerCase().includes(this.filterCriteria.roomName.toLowerCase());
      
      // Capacity range filter
      let matchCapacity = true;
      if (this.filterCriteria.capacityRange !== 'all') {
        const range = this.filterCriteria.capacityRange;
        if (range === '0-10') matchCapacity = room.capacity >= 0 && room.capacity <= 10;
        else if (range === '10-20') matchCapacity = room.capacity > 10 && room.capacity <= 20;
        else if (range === '20-50') matchCapacity = room.capacity > 20 && room.capacity <= 50;
        else if (range === '50-100') matchCapacity = room.capacity > 50 && room.capacity <= 100;
        else if (range === '100+') matchCapacity = room.capacity > 100;
      }
      
      // Room type filter
      const matchRoomType = this.filterCriteria.roomType === 'all' || 
        room.roomType === this.filterCriteria.roomType;
      
      // Status filter from quick filter
      const matchStatus = this.filterStatus === 'all' || room.status === this.filterStatus;
      
      // Status filter from advanced filter
      let matchAdvancedStatus = true;
      if (this.filterCriteria.status !== 'all') {
        const statusMap: { [key: string]: string } = {
          'AVAILABLE': 'available',
          'IN_USE': 'in-use',
          'MAINTENANCE': 'maintenance',
          'UNAVAILABLE': 'available' // Temporarily map to available
        };
        matchAdvancedStatus = room.status === statusMap[this.filterCriteria.status];
      }
      
      return matchSearch && matchRoomCode && matchRoomName && matchCapacity && 
             matchRoomType && matchStatus && matchAdvancedStatus;
    
    // Update total and reset to first page
    this.total = this.filteredRooms.length;
    this.pageIndex = 1;
    });
  }

  onApplyFilter(): void {
    this.applyFilters();
    this.message.success('Đã áp dụng bộ lọc');
  }

  onResetFilter(): void {
    this.filterCriteria = {
      roomCode: '',
      roomName: '',
      capacityRange: 'all',
      roomType: 'all',
      status: 'all'
    };
    this.searchText = '';
    this.filterStatus = 'all';
    this.applyFilters();
    this.message.info('Đã làm mới bộ lọc');
  }

  onExportData(): void {
    this.message.info('Chức năng xuất dữ liệu đang được phát triển');
  }

  // Pagination handlers
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    // Khi tích hợp BE, gọi API với pageIndex mới
    // this.loadRooms();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // Reset về trang đầu khi đổi pageSize
    // Khi tích hợp BE, gọi API với pageSize mới
    // this.loadRooms();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'available': 'Khả dụng',
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

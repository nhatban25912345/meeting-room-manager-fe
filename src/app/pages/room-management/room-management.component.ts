import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoomService, RoomData } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { RoomFilterComponent } from './room-filter/room-filter.component';
import { RoomTableComponent } from './room-table/room-table.component';
import { RoomFormModalComponent } from './room-form-modal/room-form-modal.component';
import { RoomDetailModalComponent } from './room-detail-modal/room-detail-modal.component';

interface FilterCriteria {
  roomCode: string;
  roomName: string;
  capacityRange: string | null;
  roomType: string | null;
  status: string | null;
}

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    RoomFilterComponent,
    RoomTableComponent,
    RoomFormModalComponent,
    RoomDetailModalComponent
  ],
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.scss'
})
export class RoomManagementComponent implements OnInit {
  showFilterPanel = true;
  loading = false;
  
  // Modal state
  isModalVisible = false;
  isSubmitting = false;
  isDetailModalVisible = false;
  selectedRoom: RoomData | null = null;
  
  // Pagination
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  pageSizeOptions = [5, 10, 20, 50, 100];
  
  // Sorting
  sortField = 'roomCode';
  sortOrder = 'asc';
  
  // Filter criteria
  filterCriteria: FilterCriteria = {
    roomCode: '',
    roomName: '',
    capacityRange: null,
    roomType: null,
    status: null
  };

  // Dropdown options
  capacityRangeOptions = [
    { label: 'Tất cả', value: null },
    { label: '0-10 người', value: '0-10' },
    { label: '10-20 người', value: '10-20' },
    { label: '20-50 người', value: '20-50' },
    { label: '50-100 người', value: '50-100' },
    { label: 'Trên 100 người', value: '100+' }
  ];

  roomTypeOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Trực tiếp', value: 'OFFLINE' },
    { label: 'Trực tuyến', value: 'ONLINE' }
  ];

  statusOptions = [
    { label: 'Tất cả', value: null },
    { label: 'Khả dụng', value: 'AVAILABLE' },
    { label: 'Đang sử dụng', value: 'IN_USE' },
    { label: 'Bảo trì', value: 'MAINTENANCE' },
    { label: 'Không khả dụng', value: 'UNAVAILABLE' }
  ];  
  sortFieldOptions = [
    { label: 'Mã phòng', value: 'roomCode' },
    { label: 'Tên phòng', value: 'roomName' },
    { label: 'Sức chứa', value: 'capacity' },
    { label: 'Vị trí', value: 'location' },
    { label: 'Loại phòng', value: 'roomType' },
    { label: 'Trạng thái', value: 'status' }
  ];
  
  sortOrderOptions = [
    { label: 'Tăng dần', value: 'asc' },
    { label: 'Giảm dần', value: 'desc' }
  ];  
  filteredRooms: RoomData[] = [];

  constructor(
    private message: NzMessageService,
    private roomService: RoomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }
  
  get currentUsername(): string {
    return this.authService.currentUserValue?.username || 'admin';
  }

  loadRooms(): void {
    this.loading = true;

    const filters = {
      roomCode: this.filterCriteria.roomCode || undefined,
      roomName: this.filterCriteria.roomName || undefined,
      capacityRange: this.filterCriteria.capacityRange !== null ? this.filterCriteria.capacityRange : undefined,
      roomType: this.filterCriteria.roomType !== null ? this.filterCriteria.roomType : undefined,
      status: this.filterCriteria.status !== null ? this.filterCriteria.status : undefined,
      page: this.pageIndex - 1, // Backend uses 0-based indexing
      size: this.pageSize,
      sort: `${this.sortField},${this.sortOrder}`
    };

    this.roomService.searchRooms(filters).subscribe({
      next: (response) => {
        this.filteredRooms = response.data.content;
        this.total = response.data.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.message.error('Không thể tải danh sách phòng họp');
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.pageIndex = 1;
    this.loadRooms();
  }

  onApplyFilter(): void {
    this.pageIndex = 1;
    this.loadRooms();
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
    this.sortField = 'roomCode';
    this.sortOrder = 'asc';
    this.pageIndex = 1;
    this.loadRooms();
    this.message.info('Đã làm mới bộ lọc');
  }

  onExportData(): void {
    this.message.info('Chức năng xuất dữ liệu đang được phát triển');
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  // Pagination handlers
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadRooms();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadRooms();
  }

  onSortChange(): void {
    this.pageIndex = 1;
    this.loadRooms();
  }

  onAddRoom(): void {
    this.isModalVisible = true;
  }
  
  handleModalCancel(): void {
    this.isModalVisible = false;
  }
  
  handleModalSubmit(formData: any): void {
    this.isSubmitting = true;
    
    this.roomService.createRoom(formData).subscribe({
      next: (response) => {
        this.message.success('Tạo phòng họp thành công!');
        this.isModalVisible = false;
        this.isSubmitting = false;
        this.loadRooms();
      },
      error: (error) => {
        console.error('Error creating room:', error);
        this.message.error(error.error?.status?.displayMessage || 'Không thể tạo phòng họp');
        this.isSubmitting = false;
      }
    });
  }

  onViewRoom(room: RoomData): void {
    this.selectedRoom = room;
    this.isDetailModalVisible = true;
  }

  onEditRoom(room: RoomData): void {
    this.message.info(`Chỉnh sửa phòng ${room.roomCode}`);
  }

  onDeleteRoom(room: RoomData): void {
    this.message.warning(`Xóa phòng ${room.roomCode}`);
  }
}

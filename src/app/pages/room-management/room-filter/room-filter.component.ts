import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface FilterCriteria {
  roomCode: string;
  roomName: string;
  capacityRange: string | null;
  roomType: string | null;
  status: string | null;
}

@Component({
  selector: 'app-room-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule
  ],
  templateUrl: './room-filter.component.html',
  styleUrl: './room-filter.component.scss'
})
export class RoomFilterComponent {
  @Input() filterCriteria: FilterCriteria = {
    roomCode: '',
    roomName: '',
    capacityRange: 'all',
    roomType: 'all',
    status: 'all'
  };
  
  @Input() capacityRangeOptions: any[] = [];
  @Input() roomTypeOptions: any[] = [];
  @Input() statusOptions: any[] = [];
  @Input() showFilterPanel = true;
  
  @Output() filterChange = new EventEmitter<void>();
  @Output() applyFilter = new EventEmitter<void>();
  @Output() resetFilter = new EventEmitter<void>();
  @Output() exportData = new EventEmitter<void>();
  @Output() togglePanel = new EventEmitter<void>();

  onFilterChange(): void {
    this.filterChange.emit();
  }

  onApplyFilter(): void {
    this.applyFilter.emit();
  }

  onResetFilter(): void {
    this.resetFilter.emit();
  }

  onExportData(): void {
    this.exportData.emit();
  }

  onTogglePanel(): void {
    this.togglePanel.emit();
  }
}

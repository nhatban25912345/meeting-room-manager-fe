import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-meeting-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzRadioModule,
    NzDatePickerModule
  ],
  templateUrl: './meeting-filter.component.html',
  styleUrl: './meeting-filter.component.scss'
})
export class MeetingFilterComponent {
  @Input() searchForm!: FormGroup;
  @Input() statusOptions: any[] = [];
  @Input() roomCodeOptions: any[] = [];
  @Input() showFilterPanel = false;
  
  @Output() search = new EventEmitter<void>();
  @Output() resetFilter = new EventEmitter<void>();
  @Output() exportData = new EventEmitter<void>();
  @Output() togglePanel = new EventEmitter<void>();

  onSearch(): void {
    this.search.emit();
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

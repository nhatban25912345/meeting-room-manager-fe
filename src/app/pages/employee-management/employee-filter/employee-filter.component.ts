import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface EmployeeFilterCriteria {
	user_id: string;
	full_name: string;
	phone_number: string;
	email: string;
	unit_code: string | null;
	job_title: string | null;
	role_code: string | null;
	status: number | null;
}

@Component({
	selector: 'app-employee-filter',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		NzIconModule,
		NzInputModule,
		NzSelectModule,
		NzButtonModule
	],
	templateUrl: './employee-filter.component.html',
	styleUrl: './employee-filter.component.scss'
})
export class EmployeeFilterComponent {

	@Input() filterCriteria: EmployeeFilterCriteria = {
		user_id: '',
		full_name: '',
		phone_number: '',
		email: '',
		unit_code: '',
		job_title: '',
		role_code: '',
		status: null
	};

	unitCodeOptions: any[] = [
		{ value: null, label: 'Tất cả' },
		{ value: 'VP', label: 'Văn phòng' },
		{ value: 'CNTT', label: 'Cục CNTT' },
		{ value: 'KH', label: 'Vụ Kế hoạch' },
		{ value: 'TTKT', label: 'Trung tâm Kỹ thuật' },
		{ value: 'TTVT', label: 'Trung tâm Truyền hình' }
	];
	jobTitleOptions: any[] = [
		{ value: null, label: 'Tất cả' },
		{ value: 'ADMIN', label: 'Quản trị viên' },
		{ value: 'KTV', label: 'Kỹ thuật viên' },
		{ value: 'DPV', label: 'Điều phối viên' },
		{ value: 'TK', label: 'Thư ký' }
	];
	roleCodeOptions: any[] = [
		{ value: null, label: 'Tất cả' },
		{ value: 'ADMIN', label: 'Quản trị viên' },
		{ value: 'MANAGER', label: 'Quản lý' },
		{ value: 'EMPLOYEE', label: 'Nhân viên' }
	];
	statusOptions: any[] = [
		// { value: null, label: 'Tất cả' },
		{ value: 0, label: 'Đã nghỉ việc' },
		{ value: 1, label: 'Đang làm việc' },
		{ value: 2, label: 'Đang bận' }
	];
	@Input() showFilterPanel = true;

	@Output() filterChange = new EventEmitter<void>();
	@Output() applyFilter = new EventEmitter<void>();
	@Output() resetFilter = new EventEmitter<void>();
	@Output() exportData = new EventEmitter<void>();
	@Output() togglePanel = new EventEmitter<void>();

	onFilterChange() {
		this.filterChange.emit();
	}

	onApplyFilter() {
		this.applyFilter.emit();
	}

	onResetFilter() {
		this.resetFilter.emit();
	}

	onExportData() {
		this.exportData.emit();
	}

	onTogglePanel() {
		this.togglePanel.emit();
		this.showFilterPanel = !this.showFilterPanel;
	}
}

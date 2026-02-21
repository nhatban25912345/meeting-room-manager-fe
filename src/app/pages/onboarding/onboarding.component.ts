import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';

export interface RecentMeeting {
  name: string;
  time: string;
  type: string;
  unit: string;
  status: string;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule
  ],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  loading = false;
  recentMeetings: RecentMeeting[] = [];

  ngOnInit(): void {
    this.loadRecentMeetings();
  }

  loadRecentMeetings(): void {
    this.loading = true;
    // Mô phỏng dữ liệu - thực tế sẽ call API
    setTimeout(() => {
      this.recentMeetings = [
        {
          name: 'Hội nghị giao ban tháng 2',
          time: '08:00 - 11:30',
          type: 'Trực tuyến',
          unit: '12 đơn vị',
          status: 'Đang diễn ra'
        },
        {
          name: 'Họp triển khai kế hoạch Q1',
          time: '14:00 - 16:00',
          type: 'Trực tiếp',
          unit: '8 đơn vị',
          status: 'Đã duyệt'
        },
        {
          name: 'Hội nghị tổng kết năm 2025',
          time: '09:00 - 17:00',
          type: 'Trực tuyến',
          unit: '24 đơn vị',
          status: 'Chờ duyệt'
        },
        {
          name: 'Họp ban chỉ đạo CNTT',
          time: '15:00 - 16:30',
          type: 'Kết hợp',
          unit: '6 đơn vị',
          status: 'Đã duyệt'
        },
        {
          name: 'Hội nghị sơ kết 6 tháng',
          time: '08:30 - 12:00',
          type: 'Trực tuyến',
          unit: '18 đơn vị',
          status: 'Nhập'
        }
      ];
      this.loading = false;
    }, 500);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Đang diễn ra':
        return 'green';
      case 'Đã duyệt':
        return 'blue';
      case 'Chờ duyệt':
        return 'orange';
      case 'Nhập':
        return 'default';
      default:
        return 'default';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';

export interface RecentMeeting {
  title: string;
  meetingDate: string;
  time: string;
  location: string;
  scheduleType: string;
  participants: string;
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
          title: 'Hội nghị giao ban tháng 2',
          meetingDate: '15/03/2026',
          time: '08:00 - 11:30',
          location: 'Phòng họp A1',
          scheduleType: 'Trực tuyến',
          participants: '45',
          status: 'Đang diễn ra'
        },
        {
          title: 'Họp triển khai kế hoạch Q1',
          meetingDate: '14/03/2026',
          time: '14:00 - 16:00',
          location: 'Phòng họp B2',
          scheduleType: 'Trực tiếp',
          participants: '28',
          status: 'Đã duyệt'
        },
        {
          title: 'Hội nghị tổng kết năm 2025',
          meetingDate: '12/03/2026',
          time: '09:00 - 17:00',
          location: 'Hội trường lớn',
          scheduleType: 'Trực tuyến',
          participants: '150',
          status: 'Chờ duyệt'
        },
        {
          title: 'Họp ban chỉ đạo CNTT',
          meetingDate: '11/03/2026',
          time: '15:00 - 16:30',
          location: 'Phòng họp C3',
          scheduleType: 'Kết hợp',
          participants: '20',
          status: 'Đã duyệt'
        },
        {
          title: 'Hội nghị sơ kết 6 tháng',
          meetingDate: '10/03/2026',
          time: '08:30 - 12:00',
          location: 'Phòng họp A2',
          scheduleType: 'Trực tuyến',
          participants: '85',
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

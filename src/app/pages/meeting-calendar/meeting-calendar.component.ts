import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';

interface MeetingEvent {
  title: string;
  startTime: string;
  endTime: string;
  status: 'ready' | 'preparing' | 'issue';
  statusLabel: string;
}

interface CalendarData {
  [key: string]: MeetingEvent[];
}

@Component({
  selector: 'app-meeting-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCalendarModule,
    NzBadgeModule,
    NzButtonModule,
    NzIconModule,
    NzRadioModule
  ],
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss']
})
export class MeetingCalendarComponent implements OnInit {
  pageTitle = 'Lịch họp';
  viewMode: 'month' | 'week' = 'month';
  selectedDate: Date = new Date(2026, 1, 1); // Tháng 2 2026
  
  meetingsData: CalendarData = {
    '2026-02-09': [
      {
        title: 'Giao ban tuần',
        startTime: '08:00',
        endTime: '09:30',
        status: 'ready',
        statusLabel: 'Sẵn sàng'
      }
    ],
    '2026-02-10': [
      {
        title: 'Hội nghị CNTT toàn quốc',
        startTime: '08:00',
        endTime: '17:00',
        status: 'preparing',
        statusLabel: 'Đang chuẩn bị'
      },
      {
        title: 'Họp ban chỉ đạo',
        startTime: '14:00',
        endTime: '15:30',
        status: 'ready',
        statusLabel: 'Sẵn sàng'
      }
    ],
    '2026-02-11': [
      {
        title: 'Họp triển khai dự án ABC',
        startTime: '08:00',
        endTime: '11:00',
        status: 'ready',
        statusLabel: 'Sẵn sàng'
      }
    ],
    '2026-02-12': [
      {
        title: 'Hội nghị tổng kết',
        startTime: '08:00',
        endTime: '12:00',
        status: 'issue',
        statusLabel: 'Có sự cố'
      }
    ],
    '2026-02-14': [
      {
        title: 'Họp giao ban tháng 2',
        startTime: '08:00',
        endTime: '11:30',
        status: 'ready',
        statusLabel: 'Sẵn sàng'
      },
      {
        title: 'Workshop Design Sprint',
        startTime: '14:00',
        endTime: '17:00',
        status: 'preparing',
        statusLabel: 'Đang chuẩn bị'
      }
    ],
    '2026-02-17': [
      {
        title: 'Họp về ngân sách Q2',
        startTime: '10:00',
        endTime: '11:30',
        status: 'ready',
        statusLabel: 'Sẵn sàng'
      }
    ],
    '2026-02-20': [
      {
        title: 'Hội thảo chuyên đề số',
        startTime: '08:00',
        endTime: '17:00',
        status: 'preparing',
        statusLabel: 'Đang chuẩn bị'
      }
    ]
  };

  ngOnInit(): void {
    // Initialize component
  }

  getMeetingsForDate(date: Date): MeetingEvent[] {
    const dateKey = this.formatDateKey(date);
    return this.meetingsData[dateKey] || [];
  }

  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ready':
        return 'status-ready';
      case 'preparing':
        return 'status-preparing';
      case 'issue':
        return 'status-issue';
      default:
        return '';
    }
  }

  onPanelChange(change: { date: Date; mode: string }): void {
    console.log('Panel changed:', change);
  }

  previousMonth(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.selectedDate = newDate;
  }

  nextMonth(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.selectedDate = newDate;
  }

  getCurrentMonthYear(): string {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return `${months[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;
  }
}

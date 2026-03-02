import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { MeetingService, MeetingData, MeetingSearchRequest } from '../../services/meeting.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface MeetingEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  status: 'ready' | 'preparing' | 'issue' | 'cancelled';
  statusLabel: string;
  roomCode: string;
  meetingData: MeetingData;
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
    NzRadioModule,
    NzSpinModule
  ],
  templateUrl: './meeting-calendar.component.html',
  styleUrls: ['./meeting-calendar.component.scss']
})
export class MeetingCalendarComponent implements OnInit {
  pageTitle = 'Lịch họp';
  viewMode: 'month' | 'week' = 'month';
  selectedDate: Date = new Date();
  loading = false;
  
  meetingsData: CalendarData = {};

  constructor(
    private meetingService: MeetingService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  /**
   * Load meetings for current month
   */
  loadMeetings(): void {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth() + 1;
    
    // Get first and last day of month
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    const request: MeetingSearchRequest = {
      meetingDateFrom: this.formatDateForApi(firstDay),
      meetingDateTo: this.formatDateForApi(lastDay),
      page: 0,
      size: 1000, // Load all meetings for the month
      sort: 'meetingDate,asc'
    };

    this.loading = true;
    this.meetingService.searchMeetings(request).subscribe({
      next: (response) => {
        this.meetingsData = this.convertApiDataToCalendar(response.data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading meetings:', error);
        this.message.error('Không thể tải dữ liệu lịch họp');
        this.loading = false;
        this.meetingsData = {};
      }
    });
  }

  /**
   * Convert API response to calendar format
   */
  private convertApiDataToCalendar(groups: any[]): CalendarData {
    const calendarData: CalendarData = {};
    
    groups.forEach(group => {
      const dateKey = group.meetingDate; // Already in YYYY-MM-DD format
      calendarData[dateKey] = group.meetings.map((meeting: MeetingData) => ({
        id: meeting.id,
        title: meeting.subject,
        startTime: this.formatTime(meeting.startTime),
        endTime: this.formatTime(meeting.endTime),
        status: this.mapApiStatus(meeting.status),
        statusLabel: this.getStatusLabel(meeting.status),
        roomCode: meeting.roomCode,
        meetingData: meeting
      }));
    });
    
    return calendarData;
  }

  /**
   * Map API status to UI status
   */
  private mapApiStatus(apiStatus: string): 'ready' | 'preparing' | 'issue' | 'cancelled' {
    switch (apiStatus) {
      case 'APPROVED':
        return 'ready';
      case 'CREATED':
      case 'PENDING_APPROVAL':
        return 'preparing';
      case 'REJECTED':
        return 'issue';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return 'preparing';
    }
  }

  /**
   * Get status label in Vietnamese
   */
  private getStatusLabel(apiStatus: string): string {
    switch (apiStatus) {
      case 'CREATED':
        return 'Tạo mới';
      case 'PENDING_APPROVAL':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Từ chối';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return apiStatus;
    }
  }

  /**
   * Format time from HH:mm:ss to HH:mm
   */
  private formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // Get HH:mm from HH:mm:ss
  }

  /**
   * Format date for API (YYYY-MM-DD)
   */
  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    this.loadMeetings();
  }

  nextMonth(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.selectedDate = newDate;
    this.loadMeetings();
  }

  getCurrentMonthYear(): string {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return `${months[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;
  }
}

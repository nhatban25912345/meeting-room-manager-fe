import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { MeetingService, MeetingData } from '../../services/meeting.service';

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

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.loadRecentMeetings();
  }

  loadRecentMeetings(): void {
    this.loading = true;
    
    this.meetingService.listMeetings({
      page: 0,
      size: 5,
      sort: 'createdAt,desc'
    }).subscribe({
      next: (response) => {
        this.recentMeetings = response.data.content.map(meeting => this.mapToRecentMeeting(meeting));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent meetings:', error);
        this.loading = false;
      }
    });
  }

  private mapToRecentMeeting(meeting: MeetingData): RecentMeeting {
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = meeting.meetingDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    // Format time from HH:mm:ss to HH:mm
    const startTime = meeting.startTime.substring(0, 5);
    const endTime = meeting.endTime.substring(0, 5);
    const timeRange = `${startTime} - ${endTime}`;

    // Map schedule type
    const scheduleTypeMap: { [key: string]: string } = {
      'recurring': 'Định kỳ',
      'non_recurring': 'Không định kỳ'
    };

    return {
      title: meeting.subject,
      meetingDate: formattedDate,
      time: timeRange,
      location: meeting.roomCode,
      scheduleType: scheduleTypeMap[meeting.scheduleType] || meeting.scheduleType,
      participants: meeting.participantUserIds?.length?.toString() || '0',
      status: this.getStatusLabel(meeting.status)
    };
  }

  private getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CREATED': 'Tạo mới',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối',
      'CANCELLED': 'Đã hủy',
      'PENDING_APPROVAL': 'Chờ duyệt'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Tạo mới':
        return 'default';
      case 'Đã duyệt':
        return 'green';
      case 'Chờ duyệt':
        return 'orange';
      case 'Từ chối':
        return 'red';
      case 'Đã hủy':
        return 'default';
      default:
        return 'default';
    }
  }
}

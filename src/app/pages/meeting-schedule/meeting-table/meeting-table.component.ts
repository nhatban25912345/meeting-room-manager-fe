import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

export interface MeetingSchedule {
  id: string;
  time: string;
  location: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  title: string;
  organizer: string;
  preparation: string;
  participants: string;
  internalParticipants: string;
  responseStatus: string;
  notes: string;
  meetingMinutes: string;
}

export interface MeetingGroup {
  date: string;
  dayOfWeek: string;
  count: number;
  meetings: MeetingSchedule[];
  expanded: boolean;
}

@Component({
  selector: 'app-meeting-table',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule
  ],
  templateUrl: './meeting-table.component.html',
  styleUrl: './meeting-table.component.scss'
})
export class MeetingTableComponent {
  @Input() meetingGroups: MeetingGroup[] = [];
  @Input() loading = false;
  @Input() totalMeetings = 0;
  @Input() statusOptions: any[] = [];

  @Output() toggleGroup = new EventEmitter<MeetingGroup>();
  @Output() viewDetails = new EventEmitter<MeetingSchedule>();
  @Output() editMeeting = new EventEmitter<MeetingSchedule>();
  @Output() deleteMeeting = new EventEmitter<MeetingSchedule>();

  onToggleGroup(group: MeetingGroup): void {
    this.toggleGroup.emit(group);
  }

  onViewDetails(meeting: MeetingSchedule): void {
    this.viewDetails.emit(meeting);
  }

  onEditMeeting(meeting: MeetingSchedule): void {
    this.editMeeting.emit(meeting);
  }

  onDeleteMeeting(meeting: MeetingSchedule): void {
    this.deleteMeeting.emit(meeting);
  }

  getStatusColor(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option?.color || 'default';
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option?.label || status;
  }
}

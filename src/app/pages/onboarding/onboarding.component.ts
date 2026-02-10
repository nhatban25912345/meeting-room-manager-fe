import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface MeetingBooking {
  id: string;
  roomName: string;
  userName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  rejectReason?: string;
}

export interface RoomStatistics {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule
  ],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  selectedIndex = 0;
  loading = false;
  pendingBookings: MeetingBooking[] = [];
  approvedBookings: MeetingBooking[] = [];
  rejectedBookings: MeetingBooking[] = [];
  
  roomStats: RoomStatistics = {
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0
  };

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    this.loadData();
    this.loadRoomStatistics();
  }

  loadRoomStatistics(): void {
    // TODO: Replace with actual API call
    this.roomStats = {
      total: 28,
      available: 15,
      occupied: 11,
      maintenance: 2
    };
  }

  loadData(): void {
    this.loading = true;
    
    // Mô phỏng dữ liệu - thực tế sẽ call API
    setTimeout(() => {
      this.pendingBookings = [
        {
          id: 'BK001',
          roomName: 'Phòng họp A',
          userName: 'Nguyễn Văn A',
          date: new Date('2026-02-10'),
          startTime: '09:00',
          endTime: '11:00',
          status: 'pending'
        },
        {
          id: 'BK002',
          roomName: 'Phòng họp B',
          userName: 'Trần Thị B',
          date: new Date('2026-02-11'),
          startTime: '14:00',
          endTime: '16:00',
          status: 'pending'
        },
        {
          id: 'BK003',
          roomName: 'Phòng họp C',
          userName: 'Lê Văn C',
          date: new Date('2026-02-12'),
          startTime: '10:00',
          endTime: '12:00',
          status: 'pending'
        }
      ];

      this.approvedBookings = [
        {
          id: 'BK004',
          roomName: 'Phòng họp A',
          userName: 'Phạm Văn D',
          date: new Date('2026-02-09'),
          startTime: '09:00',
          endTime: '10:30',
          status: 'approved',
          approvedBy: 'Admin'
        },
        {
          id: 'BK005',
          roomName: 'Phòng họp B',
          userName: 'Hoàng Thị E',
          date: new Date('2026-02-08'),
          startTime: '13:00',
          endTime: '15:00',
          status: 'approved',
          approvedBy: 'Manager'
        }
      ];

      this.rejectedBookings = [
        {
          id: 'BK006',
          roomName: 'Phòng họp C',
          userName: 'Đỗ Văn F',
          date: new Date('2026-02-07'),
          startTime: '16:00',
          endTime: '18:00',
          status: 'rejected',
          rejectReason: 'Phòng đã được đặt trước'
        }
      ];

      this.loading = false;
    }, 1000);
  }

  approveBooking(bookingId: string): void {
    this.loading = true;
    // Mô phỏng API call
    setTimeout(() => {
      const booking = this.pendingBookings.find(b => b.id === bookingId);
      if (booking) {
        booking.status = 'approved';
        booking.approvedBy = 'Current User';
        this.approvedBookings = [...this.approvedBookings, booking];
        this.pendingBookings = this.pendingBookings.filter(b => b.id !== bookingId);
        this.message.success('Đã phê duyệt đặt phòng thành công!');
      }
      this.loading = false;
    }, 500);
  }

  rejectBooking(bookingId: string): void {
    this.loading = true;
    // Mô phỏng API call
    setTimeout(() => {
      const booking = this.pendingBookings.find(b => b.id === bookingId);
      if (booking) {
        booking.status = 'rejected';
        booking.rejectReason = 'Không phù hợp';
        this.rejectedBookings = [...this.rejectedBookings, booking];
        this.pendingBookings = this.pendingBookings.filter(b => b.id !== bookingId);
        this.message.warning('Đã từ chối đặt phòng!');
      }
      this.loading = false;
    }, 500);
  }
}

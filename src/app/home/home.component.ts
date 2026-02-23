import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    NzBadgeModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  currentUser: User | null = null;
  notificationCount = 3; // Số thông báo chưa đọc
  
  // Permission-based access control
  canViewHome = true; // Tất cả user đều xem được
  canManagePlans = false;
  canViewMeetingCalendar = false;
  canViewRooms = false;
  canManageUsers = false;
  canViewDashboard = false;
  canAccessSettings = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.checkPermissions();
  }

  getInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    const names = this.currentUser.fullName.split(' ');
    if (names.length >= 2) {
      return (names[names.length - 2].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  }

  private checkPermissions(): void {
    // Quản lý kế hoạch - cần quyền tạo hoặc xem meeting
    this.canManagePlans = this.authService.hasPermission('MEETING_CREATE') || 
                          this.authService.hasPermission('MEETING_VIEW_LIST');
    
    // Lịch họp - cần quyền xem calendar
    this.canViewMeetingCalendar = this.authService.hasPermission('MEETING_VIEW_CALENDAR_DAY') ||
                                   this.authService.hasPermission('MEETING_VIEW_CALENDAR_WEEK') ||
                                   this.authService.hasPermission('MEETING_VIEW_CALENDAR_MONTH') ||
                                   this.authService.hasPermission('MEETING_VIEW_LIST');
    
    // Phòng họp - cần quyền xem room
    this.canViewRooms = this.authService.hasPermission('ROOM_VIEW');
    
    // Người dùng - cần quyền xem user
    this.canManageUsers = this.authService.hasPermission('USER_VIEW');
    
    // Thống kê - cần quyền xem dashboard hoặc báo cáo
    this.canViewDashboard = this.authService.hasPermission('DASHBOARD_VIEW') ||
                            this.authService.hasPermission('REPORT_VIEW_ROOM_USAGE') ||
                            this.authService.hasPermission('REPORT_GENERATE');
    
    // Cài đặt - chỉ ADMIN (hoặc có thể thêm permission cụ thể)
    this.canAccessSettings = this.authService.hasRole(['ADMIN']);
  }

  logout(): void {
    this.authService.logout();
  }
}

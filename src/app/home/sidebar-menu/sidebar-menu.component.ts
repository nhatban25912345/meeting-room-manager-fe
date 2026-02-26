import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzIconModule
  ],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent implements OnInit {
  @Input() isCollapsed = false;

  // Permission-based access control
  canViewHome = true; // Tất cả user đều xem được
  canManagePlans = false;
  canScheduleMeeting = false;
  canViewMeetingCalendar = false;
  canViewRooms = false;
  canManageUsers = false;
  canViewDashboard = false;
  canAccessSettings = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkPermissions();
  }

  private checkPermissions(): void {
    // Quản lý kế hoạch - cần quyền tạo hoặc xem meeting
    this.canManagePlans = this.authService.hasPermission('MEETING_CREATE') || 
                          this.authService.hasPermission('MEETING_VIEW_LIST');
    
    // Lên lịch họp - cần quyền tạo meeting
    this.canScheduleMeeting = this.authService.hasPermission('MEETING_CREATE');
    
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
}

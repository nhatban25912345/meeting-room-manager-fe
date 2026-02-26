import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AuthService, User } from '../services/auth.service';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    NzBadgeModule,
    SidebarMenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  currentUser: User | null = null;
  notificationCount = 3; // Số thông báo chưa đọc

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  getInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    const names = this.currentUser.fullName.split(' ');
    if (names.length >= 2) {
      return (names[names.length - 2].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}

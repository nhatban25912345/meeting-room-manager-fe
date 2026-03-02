import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    NzDividerModule,
    NzAvatarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible = false;
  loading = false;

  private readonly REMEMBER_USERNAME_KEY = 'rememberedUsername';
  private readonly REMEMBER_PASSWORD_KEY = 'rememberedPassword';
  private readonly REMEMBER_ME_KEY = 'rememberMe';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  ngOnInit(): void {
    // Kiểm tra và tải thông tin đăng nhập đã lưu
    this.loadRememberedCredentials();
  }

  private loadRememberedCredentials(): void {
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    
    if (rememberMe) {
      const savedUsername = localStorage.getItem(this.REMEMBER_USERNAME_KEY);
      const savedPassword = localStorage.getItem(this.REMEMBER_PASSWORD_KEY);
      
      if (savedUsername && savedPassword) {
        this.loginForm.patchValue({
          username: savedUsername,
          password: savedPassword,
          remember: true
        });
      }
    }
  }

  private saveCredentials(username: string, password: string, remember: boolean): void {
    if (remember) {
      localStorage.setItem(this.REMEMBER_USERNAME_KEY, username);
      localStorage.setItem(this.REMEMBER_PASSWORD_KEY, password);
      localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
    } else {
      this.clearSavedCredentials();
    }
  }

  private clearSavedCredentials(): void {
    localStorage.removeItem(this.REMEMBER_USERNAME_KEY);
    localStorage.removeItem(this.REMEMBER_PASSWORD_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password, remember } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response.status.statusCode === 'SUCCESS') {
            // Lưu thông tin đăng nhập nếu người dùng chọn ghi nhớ
            this.saveCredentials(username, password, remember);
            
            this.message.success(response.status.displayMessage || 'Đăng nhập thành công!');
            this.router.navigate(['/meeting-management']);
          } else {
            this.message.error(response.status.displayMessage || 'Đăng nhập thất bại!');
          }
          this.loading = false;
        },
        error: (error) => {
          const errorMessage = error?.error?.status?.displayMessage || 'Đã có lỗi xảy ra. Vui lòng thử lại!';
          this.message.error(errorMessage);
          this.loading = false;
        }
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onFeatureGoing(): void {
    // show a message that this feature is not implemented yet
    this.message.info('Tính năng này đang được phát triển.');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Incident {
  status: string;
  id: string;
  title: string;
}

export interface OnboardingInfo {
  totalMeetingSchedules: number;
  meetingRoomsToday: number;
  totalAvailableUsers: number;
  incidents: number;
}

export interface ApiStatus {
  errorCode: string;
  errorMessage: string;
  statusCode: string;
  responseTime: string;
  displayMessage: string;
}

export interface OnboardingInfoResponse {
  status: ApiStatus;
  data: OnboardingInfo;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private apiUrl = `${environment.apiUrl}/common`;

  constructor(private http: HttpClient) {}

  /**
   * Get onboarding information for dashboard
   */
  getOnboardingInfo(): Observable<OnboardingInfoResponse> {
    return this.http.get<OnboardingInfoResponse>(`${this.apiUrl}/onboarding-info`);
  }
}

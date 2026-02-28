import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// API Response interfaces
export interface ApiStatus {
  errorCode: string;
  errorMessage: string;
  statusCode: string;
  responseTime: string;
  displayMessage: string;
}

export interface ParticipantUser {
  userId: string;
  fullName: string;
}

export interface MeetingData {
  id: number;
  meetingCode: string | null;
  subject: string;
  content: string;
  roomCode: string;
  startTime: string; // Format: HH:mm:ss
  endTime: string; // Format: HH:mm:ss
  meetingDate: string; // Format: YYYY-MM-DD
  organizerUnit: string;
  contactEmail: string;
  dressCode: string;
  scheduleType: string; // 'recurring' | 'non_recurring'
  recurrencePattern: string | null;
  recurrenceEndDate: string | null;
  note: string | null;
  attachment: string | null;
  preparationTasks: string | null;
  conclusionUnit: string | null;
  status: string; // 'CREATED' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdBy: string;
  createdAt: string;
  participantUserIds: ParticipantUser[];
}

export interface MeetingSearchRequest {
  roomCode?: string;
  meetingDateFrom?: string; // Format: YYYY-MM-DD
  meetingDateTo?: string; // Format: YYYY-MM-DD
  createdAtFrom?: string; // Format: YYYY-MM-DD
  createdAtTo?: string; // Format: YYYY-MM-DD
  status?: string;
  scheduleType?: string;
  organizer?: string; // Người chủ trì cuộc họp
  page?: number;
  size?: number;
  sort?: string;
}

// API Response from backend (already grouped)
export interface MeetingGroupResponse {
  meetingDate: string; // Format: YYYY-MM-DD
  dayOfWeek: string; // e.g., "MONDAY", "TUESDAY"
  totalMeetings: number;
  meetings: MeetingData[];
}

export interface MeetingApiResponse {
  status: ApiStatus;
  data: MeetingGroupResponse[];
}

export interface MeetingDetailResponse {
  status: ApiStatus;
  data: MeetingData;
}

// Create meeting request interface
export interface CreateMeetingRequest {
  subject: string;
  content: string;
  roomCode: string;
  startTime: string; // Format: HH:mm:ss
  endTime: string; // Format: HH:mm:ss
  meetingDate: string; // Format: YYYY-MM-DD
  organizerUnit: string;
  meetingHost: string; // User ID
  contactEmail: string;
  dressCode: string;
  scheduleType: string; // 'recurring' | 'non_recurring'
  note?: string;
  conclusionUnit?: string;
  participantUserIds: string[]; // Array of user IDs
  recurrencePattern?: string;
  recurrenceEndDate?: string;
  attachment?: string;
  preparationTasks?: string;
}

export interface CreateMeetingResponse {
  status: ApiStatus;
  data: MeetingData;
}

export interface MeetingListRequest {
  page: number;
  size: number;
  sort: string;
  status?: string;
}

export interface MeetingListResponse {
  status: ApiStatus;
  data: {
    content: MeetingData[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
}

// Grouped data interface
export interface MeetingGroup {
  meetingDate: string; // Format: DD/MM/YYYY
  dayOfWeek: string; // e.g., "Thứ hai"
  count: number;
  meetings: MeetingData[];
  expanded?: boolean;
}

export interface GroupedMeetingsResponse {
  groups: MeetingGroup[];
  totalMeetings: number;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = `${environment.apiUrl}/meeting-schedule`;

  constructor(private http: HttpClient) {}

  /**
   * Search meetings with filters using POST method
   * Returns data grouped by meeting_date and sorted in descending order
   */
  searchMeetings(request: MeetingSearchRequest): Observable<MeetingApiResponse> {
    // Build request body, removing undefined/null values
    const body: any = {};
    
    if (request.roomCode) body.roomCode = request.roomCode;
    if (request.meetingDateFrom) body.meetingDateFrom = request.meetingDateFrom;
    if (request.meetingDateTo) body.meetingDateTo = request.meetingDateTo;
    if (request.createdAtFrom) body.createdAtFrom = request.createdAtFrom;
    if (request.createdAtTo) body.createdAtTo = request.createdAtTo;
    if (request.status) body.status = request.status;
    if (request.scheduleType) body.scheduleType = request.scheduleType;
    if (request.organizer) body.organizer = request.organizer;
    
    // Add pagination
    body.page = request.page ?? 0;
    body.size = request.size ?? 10;
    body.sort = request.sort ?? 'meetingDate,desc';

    return this.http.post<MeetingApiResponse>(`${this.apiUrl}/search`, body);
  }

  /**
   * Search meetings and group by meeting date
   */
  searchMeetingsGrouped(request: MeetingSearchRequest): Observable<GroupedMeetingsResponse> {
    return this.searchMeetings(request).pipe(
      map(response => this.mapApiResponseToGrouped(response))
    );
  }

  /**
   * Map API response (already grouped) to UI model
   */
  private mapApiResponseToGrouped(response: MeetingApiResponse): GroupedMeetingsResponse {
    const dayOfWeekMap: { [key: string]: string } = {
      'MONDAY': 'Thứ hai',
      'TUESDAY': 'Thứ ba',
      'WEDNESDAY': 'Thứ tư',
      'THURSDAY': 'Thứ năm',
      'FRIDAY': 'Thứ sáu',
      'SATURDAY': 'Thứ bảy',
      'SUNDAY': 'Chủ nhật'
    };

    const groups = response.data.map(group => ({
      meetingDate: this.formatDate(group.meetingDate),
      dayOfWeek: dayOfWeekMap[group.dayOfWeek] || group.dayOfWeek,
      count: group.totalMeetings,
      meetings: group.meetings,
      expanded: false
    }));

    const totalMeetings = response.data.reduce((sum, group) => sum + group.totalMeetings, 0);

    return {
      groups,
      totalMeetings
    };
  }

  /**
   * Format date from YYYY-MM-DD to DD/MM/YYYY
   */
  private formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  /**
   * Get meeting by ID
   */
  getMeetingById(id: string): Observable<MeetingDetailResponse> {
    return this.http.get<MeetingDetailResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new meeting
   */
  createMeeting(data: CreateMeetingRequest): Observable<CreateMeetingResponse> {
    return this.http.post<CreateMeetingResponse>(`${this.apiUrl}/create`, data);
  }

  /**
   * Update meeting
   */
  updateMeeting(id: string, data: Partial<MeetingData>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete meeting
   */
  deleteMeeting(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Submit meeting for approval
   */
  submitForApproval(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-for-approval/${id}`, {});
  }

  /**
   * Approve meeting
   */
  approveMeeting(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve/${id}`, {});
  }

  /**
   * Reject meeting
   */
  rejectMeeting(id: string, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reject/${id}`, reason ? { reason } : {});
  }

  /**
   * Cancel meeting
   */
  cancelMeeting(id: string, reason?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cancel/${id}`, reason ? { reason } : {});
  }

  /**
   * List meetings by status with pagination
   */
  listMeetings(request: MeetingListRequest): Observable<MeetingListResponse> {
    const body: any = {
      page: request.page,
      size: request.size,
      sort: request.sort
    };
    
    if (request.status) {
      body.status = request.status;
    }
    
    return this.http.post<MeetingListResponse>(`${this.apiUrl}/list`, body);
  }
}

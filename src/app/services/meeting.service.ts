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

export interface MeetingData {
  id: string;
  roomCode: string;
  roomName: string;
  location: string;
  meetingDate: string; // Format: YYYY-MM-DD
  timeFrom: string; // Format: HH:mm
  timeTo: string; // Format: HH:mm
  title: string;
  organizer: string;
  organizerUnit: string;
  participants: string;
  internalParticipants: string;
  externalParticipants: string;
  preparation: string;
  preparationUnit: string;
  attachments: string;
  notes: string;
  meetingMinutes: string;
  responseStatus: string;
  status: string; // 'pending' | 'approved' | 'rejected' | 'cancelled'
  scheduleType: string; // 'recurring' | 'one-time'
  meetingType: string; // 'internal' | 'external' | 'mixed'
  recurringConfig: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface MeetingQueryParams {
  roomCode?: string;
  meetingDateFrom?: string; // Format: YYYY-MM-DD
  meetingDateTo?: string; // Format: YYYY-MM-DD
  createdAtFrom?: string; // Format: YYYY-MM-DD
  createdAtTo?: string; // Format: YYYY-MM-DD
  status?: string;
  scheduleType?: string;
  organizer?: string; // Người chủ trì cuộc họp
  pageNumber?: number;
  pageSize?: number;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    unsorted: boolean;
    empty: boolean;
    sorted: boolean;
  };
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface MeetingPageResponse {
  content: MeetingData[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface MeetingApiResponse {
  status: ApiStatus;
  data: MeetingPageResponse;
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
  private apiUrl = `${environment.apiUrl}/meetings`;

  constructor(private http: HttpClient) {}

  /**
   * Query meetings with filters
   * Returns data grouped by meeting_date and sorted in descending order
   */
  queryMeetings(params: MeetingQueryParams): Observable<MeetingApiResponse> {
    let httpParams = new HttpParams();

    // Add query parameters
    if (params.roomCode) {
      httpParams = httpParams.set('roomCode', params.roomCode);
    }
    if (params.meetingDateFrom) {
      httpParams = httpParams.set('meetingDateFrom', params.meetingDateFrom);
    }
    if (params.meetingDateTo) {
      httpParams = httpParams.set('meetingDateTo', params.meetingDateTo);
    }
    if (params.createdAtFrom) {
      httpParams = httpParams.set('createdAtFrom', params.createdAtFrom);
    }
    if (params.createdAtTo) {
      httpParams = httpParams.set('createdAtTo', params.createdAtTo);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.scheduleType) {
      httpParams = httpParams.set('scheduleType', params.scheduleType);
    }
    if (params.organizer) {
      httpParams = httpParams.set('organizer', params.organizer);
    }
    if (params.pageNumber !== undefined) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize !== undefined) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    // Add sorting by meetingDate descending
    httpParams = httpParams.set('sort', 'meetingDate,desc');

    return this.http.get<MeetingApiResponse>(this.apiUrl, { params: httpParams });
  }

  /**
   * Query meetings and group by meeting date
   */
  queryMeetingsGrouped(params: MeetingQueryParams): Observable<GroupedMeetingsResponse> {
    return this.queryMeetings(params).pipe(
      map(response => this.groupMeetingsByDate(response.data.content, response.data.totalElements))
    );
  }

  /**
   * Group meetings by meeting date
   * @param meetings Array of meeting data
   * @param totalMeetings Total number of meetings
   * @returns Grouped meetings by date
   */
  private groupMeetingsByDate(meetings: MeetingData[], totalMeetings: number): GroupedMeetingsResponse {
    const groupedMap = new Map<string, MeetingData[]>();

    // Group meetings by date
    meetings.forEach(meeting => {
      const date = meeting.meetingDate;
      if (!groupedMap.has(date)) {
        groupedMap.set(date, []);
      }
      groupedMap.get(date)!.push(meeting);
    });

    // Convert to array and format
    const groups: MeetingGroup[] = Array.from(groupedMap.entries())
      .map(([date, meetingList]) => ({
        meetingDate: this.formatDate(date),
        dayOfWeek: this.getDayOfWeek(date),
        count: meetingList.length,
        meetings: meetingList,
        expanded: false
      }))
      .sort((a, b) => {
        // Sort by date descending
        const dateA = this.parseDate(a.meetingDate);
        const dateB = this.parseDate(b.meetingDate);
        return dateB.getTime() - dateA.getTime();
      });

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
   * Parse date from DD/MM/YYYY to Date object
   */
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  /**
   * Get day of week in Vietnamese
   */
  private getDayOfWeek(dateStr: string): string {
    const date = new Date(dateStr);
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return days[date.getDay()];
  }

  /**
   * Get meeting by ID
   */
  getMeetingById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new meeting
   */
  createMeeting(data: Partial<MeetingData>): Observable<any> {
    return this.http.post(this.apiUrl, data);
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
   * Approve meeting
   */
  approveMeeting(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  /**
   * Reject meeting
   */
  rejectMeeting(id: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, { reason });
  }

  /**
   * Cancel meeting
   */
  cancelMeeting(id: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel`, { reason });
  }
}

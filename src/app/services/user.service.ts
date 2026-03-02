import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSearchFilter {
  userId?: number;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  unitCode?: string;
  jobTitle?: string;
  roleCode?: string;
  status?: number;
}

export interface ParticipantUser {
  userId: number;
  fullName: string;
}

export interface ParticipantsResponse {
  status: {
    errorCode: string;
    errorMessage: string;
    statusCode: string;
    responseTime: string;
    displayMessage: string;
  };
  data: ParticipantUser[];
}

export interface UserSearchResponse {
  status: {
    errorCode: string;
    errorMessage: string;
    statusCode: string;
    responseTime: string;
    displayMessage: string;
  };
  data: {
    content: any[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export interface UpdateRoleRequest {
  userId: number;
  roleCode: string;
}

export interface UpdateRoleResponse {
  status: {
    errorCode: string;
    errorMessage: string;
    statusCode: string;
    responseTime: string;
    displayMessage: string;
  };
  data: any;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  unitCode: string;
  jobTitle: string;
  roleCode: string;
}

export interface CreateUserResponse {
  status: {
    errorCode: string;
    errorMessage: string;
    statusCode: string;
    responseTime: string;
    displayMessage: string;
  };
  data: any;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  searchUsers(
    filter: UserSearchFilter,
    page: number = 0,
    size: number = 10,
    sort: string = 'userId,asc',
    token: string
  ): Observable<UserSearchResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<UserSearchResponse>(`${this.baseUrl}/search`, filter, { params, headers });
  }

  updateUserRole(
    request: UpdateRoleRequest,
    token: string
  ): Observable<UpdateRoleResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<UpdateRoleResponse>(`${this.baseUrl}/update-role`, request, { headers });
  }

  createUser(
    request: CreateUserRequest,
    token: string
  ): Observable<CreateUserResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<CreateUserResponse>(`${this.baseUrl}/register`, request, { headers });
  }

  // Get all active users for participant selection
  getAllParticipants(): Observable<ParticipantsResponse> {
    return this.http.get<ParticipantsResponse>(`${this.baseUrl}/active`);
  }
}

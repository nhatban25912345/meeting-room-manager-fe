import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/user/search`;

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

    return this.http.post<UserSearchResponse>(this.apiUrl, filter, { params, headers });
  }
}

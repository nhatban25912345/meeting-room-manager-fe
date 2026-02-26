import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// API Response interfaces
export interface ApiStatus {
  errorCode: string;
  errorMessage: string;
  statusCode: string;
  responseTime: string;
  displayMessage: string;
}

export interface RoomData {
  roomId: string;
  roomCode: string;
  roomName: string;
  location: string;
  capacity: number;
  managementUnitName: string;
  transmissionConfig: string;
  roomType: string;
  status: string;
  notes: string;
  createdDate: string | null;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
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

export interface RoomPageResponse {
  content: RoomData[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    empty: boolean;
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface RoomApiResponse {
  status: ApiStatus;
  data: RoomPageResponse;
}

export interface RoomSearchRequest {
  roomCode?: string;
  roomName?: string;
  capacityRange?: string;
  roomType?: string;
  status?: string;
  page: number;
  size: number;
  sort?: string;
}

export interface AvailableRoom {
  roomCode: string;
  roomName: string;
}

export interface AvailableRoomsResponse {
  status: ApiStatus;
  data: AvailableRoom[];
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchRooms(request: RoomSearchRequest): Observable<RoomApiResponse> {
    // Filter out 'all' values and empty strings
    const filteredRequest: any = {
      page: request.page,
      size: request.size
    };

    if (request.roomCode) filteredRequest.roomCode = request.roomCode;
    if (request.roomName) filteredRequest.roomName = request.roomName;
    if (request.capacityRange && request.capacityRange !== 'all') {
      filteredRequest.capacityRange = request.capacityRange;
    }
    if (request.roomType && request.roomType !== 'all') {
      filteredRequest.roomType = request.roomType;
    }
    if (request.status && request.status !== 'all') {
      filteredRequest.status = request.status;
    }
    if (request.sort) filteredRequest.sort = request.sort;

    return this.http.post<RoomApiResponse>(
      `${this.apiUrl}/api/meeting-room/search`,
      filteredRequest
    );
  }

  // Placeholder methods for future implementation
  getRoomById(roomId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/meeting-room/${roomId}`);
  }

  createRoom(room: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/meeting-room`, room);
  }

  updateRoom(roomId: string, room: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/meeting-room/${roomId}`, room);
  }

  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/meeting-room/${roomId}`);
  }

  getAvailableRooms(): Observable<AvailableRoomsResponse> {
    return this.http.get<AvailableRoomsResponse>(
      `${this.apiUrl}/api/meeting-room/available`
    );
  }
}

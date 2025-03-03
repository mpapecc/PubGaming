import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  getRooms(hostId: string) {
    return this.http.get(environment.apiUrl + `api/Room/GetRooms?hostId=${hostId}`)
  }

  getRoomData(hostId: string, roomId: number) {
    return this.http.get(environment.apiUrl + `api/Room/GetRoomData?hostId=${hostId}&roomId=${roomId}`)
  }
}

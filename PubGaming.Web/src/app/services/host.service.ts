import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  protected url: string = environment.apiUrl + "api/Host/";

  constructor(public http: HttpClient) { }

  public isHostActive(hostConnectionId: string, roomId: number = 0) {
    return this.http.get<any>(this.url + `IsHostActive?hostConnectionId=${hostConnectionId}&roomId=${roomId}`)
  }

  public isConnectionHostOfRoom(hostConnectionId: string, roomId: number = 0) {
    return this.http.get<any>(this.url + `IsConnectionHostOfRoom?hostConnectionId=${hostConnectionId}&roomId=${roomId}`)
  }
}

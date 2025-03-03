import { Injectable } from '@angular/core';
import { HubService } from './hub.service';
import { GameHubService, GameHubServiceActions } from './game-hub.service';
import { HubConstants } from 'src/app/constants/hub.constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoomHubService {
  currentRoomData: any = {} as any;
  reconnectPossibleToRooms: any[] = [];
  playersInRoom: any[] = [];

  constructor(
    public hubService: HubService,
    public gameHubService: GameHubService,
    public router: Router
  ) { }

  reconnectToRoom = (roomId: number) => {
    this.hubService.isConnected ? this.handleSoftReconnect(roomId) : this.handleHardReconnect(roomId);
  }

  public handleSoftReconnect(roomId: number) {
    this.currentRoomData = this.getRoomFromAvailableRoomsById(roomId);
    this.router.navigate([`/host/${roomId}`]);
  }

  public handleHardReconnect(roomId: number) {
    let oldConnectionId = localStorage.getItem(HubConstants.HostConnectionId);

    this.hubService.connect((connectionId) => {
      this.reconnectHostWithNewConnectionId(oldConnectionId!);
      localStorage.setItem(HubConstants.HostConnectionId, connectionId);
      this.currentRoomData = this.getRoomFromAvailableRoomsById(roomId);
      this.gameHubService.onNotifyAdminPlayerJoinedRoom(result => {
        this.playersInRoom.push({ name: result.playerName, connectionId: result.connectionId });
        console.log(result)
      });
    }).then(() => this.router.navigate([`/host/${roomId}`]));
  }

  public reconnectHostWithNewConnectionId(oldConnectionId: string) {
    return this.hubService.connection.invoke(GameHubServiceActions.ReconnectHostWithNewConnectionId, oldConnectionId);
  }

  private getRoomFromAvailableRoomsById(roomId: number) {
    return this.reconnectPossibleToRooms.find(x => x.id === roomId)
  }
}

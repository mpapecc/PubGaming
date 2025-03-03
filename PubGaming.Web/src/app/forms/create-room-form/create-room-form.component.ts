import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HubConstants } from 'src/app/constants/hub.constants';
import { HostService } from 'src/app/services/host.service';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';
import { HubService } from 'src/app/services/hubs/hub.service';
import { RoomHubService } from 'src/app/services/hubs/room-hub.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-create-room-form',
  templateUrl: './create-room-form.component.html',
  styleUrls: ['./create-room-form.component.css']
})
export class CreateRoomFormComponent implements OnInit {
  roomName = this.fb.control('')
  hostConnectionId: string | null = "";

  constructor(
    public fb: FormBuilder,
    public gameHubService: GameHubService,
    public roomHubService: RoomHubService,
    public roomService: RoomService,
    public hubService: HubService,
    public hostService: HostService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.hostConnectionId = localStorage.getItem(HubConstants.HostConnectionId);

    this.roomService.getRooms(this.hostConnectionId!).subscribe((result: any) => {
      this.roomHubService.reconnectPossibleToRooms = result;
    })
  }

  public reconnectIfPossibleAndCreateGameRoom = () => {

    if (this.hubService.isConnected) {
      this.createGameRoom();
    }
    else if (!this.hubService.isConnected && this.hostConnectionId) {
      this.hostService.isHostActive(this.hostConnectionId).subscribe(result => {
        if (result.isHostActive)
          this.reconnectAndCreateRoom(this.hostConnectionId!);
        else
          this.connectAndCreateRoom();
      });
    }
    else
      this.connectAndCreateRoom();
  }

  private createGameRoom() {
    this.gameHubService.createGameRoom(this.roomName.value!, (roomId: number) => {
      this.router.navigate([`/host/${roomId}`]);
      this.gameHubService.onNotifyAdminPlayerJoinedRoom(result => {
        this.roomHubService.playersInRoom.push({ name: result.playerName, connectionId: result.connectionId });
        console.log(result)
      });
    });
  }

  reconnectAndCreateRoom(oldConnectionId: string) {
    this.hubService.connect((connectionId) => {
      this.roomHubService.reconnectHostWithNewConnectionId(oldConnectionId!).then(() => {
        this.createGameRoom();
      })

      localStorage.setItem(HubConstants.HostConnectionId, connectionId);
    });
  }

  private connectAndCreateRoom() {
    this.hubService.connect((connectionId) => {
      localStorage.setItem(HubConstants.HostConnectionId, connectionId);
      this.createGameRoom()
    });
  }


}

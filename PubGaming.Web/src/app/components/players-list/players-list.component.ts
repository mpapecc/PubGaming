import { Component, Input, OnInit } from '@angular/core';
import { RoomHubService } from 'src/app/services/hubs/room-hub.service';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent {
  constructor(public roomHubService: RoomHubService){}
}

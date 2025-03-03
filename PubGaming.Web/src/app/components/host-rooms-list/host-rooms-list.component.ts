import { Component, Input } from '@angular/core';
import { GameHubService } from 'src/app/services/hubs/game-hub.service';

@Component({
  selector: 'app-host-rooms-list',
  templateUrl: './host-rooms-list.component.html',
  styleUrls: ['./host-rooms-list.component.css']
})
export class HostRoomsListComponent {
  @Input() reconnectPossibleToRooms: any[] = [];
  @Input() reconnectToRoom!: (roomId: number) => void;
}
